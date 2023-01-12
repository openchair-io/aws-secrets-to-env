#! /usr/bin/env node

import fs from "fs";
import path from "path";
import {
  GetSecretValueCommand,
  SecretsManagerClient
} from "@aws-sdk/client-secrets-manager";
import figlet from "figlet";
import { Command } from "commander";
import clc from "cli-color";

const program = new Command();
const error = clc.redBright.bold;
const info = clc.greenBright.bold;

console.log(`${figlet.textSync("openchair . io")}${"\n"}`);

program.name("oc").version("0.0.1").description("OpenChair CLI");

program
  .configureOutput({
    outputError: (str, write) => write(error(str))
  })
  .showHelpAfterError();

program
  .command("secrets")
  .argument("<secrets manager id>")
  .option("-p, --path <value>", "Path to output local secrets file to", ".env")
  .option(
    "--region, --region <value>",
    "AWS Region defaults to `us-east-1`",
    "us-east-1"
  )
  .option(
    "--access-key-id, --access-key-id <value>",
    "AWS client id by default looks for AWS_ACCESS_KEY_ID set in the envirnment"
  )
  .option(
    "--secret-access-key, --secret-access-key <value>",
    "AWS secret access key by default looks for AWS_SECRET_ACCESS_KEY set in the envirnment"
  )
  .action(execute);

program.parse(process.argv);

export async function execute(secretId: string, options: any) {
  try {
    console.log(info("info: starting"));
    const client = new SecretsManagerClient({ region: options.region });
    const command = new GetSecretValueCommand({ SecretId: secretId });
    const response = await client.send(command);

    if (response.SecretString) {
      console.log(info(`info: fetched secret${"\n"}`));
      const parsed = JSON.parse(response.SecretString);

      return writeEnv(parsed, options.path);
    }
  } catch (err) {
    program.error(error(err));
  }
}

export function writeEnv(keyValuePairs: any, filePath: string) {
  try {
    const envFile = path.resolve(filePath);
    const writeStream = fs.createWriteStream(envFile);

    Object.entries(keyValuePairs).map(([key, value]) => {
      console.log(info(`info: ${key}`));
      const v = `export ${key.toUpperCase()}=${value}${`\n`}`;
      const exportString = v;

      writeStream.write(exportString);
    });

    console.log(info(`info: writing to ${envFile}`));
    console.log(info("info: done"));
  } catch (err) {
    program.error(error(err));
  }
}
