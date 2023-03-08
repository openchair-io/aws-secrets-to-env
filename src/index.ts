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

program.name("oc").version("0.0.1").description("OpenChair Secrets Manager");

program
  .configureOutput({
    outputError: (str, write) => write(error(str))
  })
  .showHelpAfterError();

program
  .command("secrets")
  .argument("<aws secrets manager secret name>")
  .option("--path <value>", "Path to output local secrets file to", ".env")
  .option(
    "--prepend <value>",
    "Prepend text to each line in the exported file i.e. `export VARIABLE_NAME=`. The default format is `VARIABLE_NAME=`",
    ""
  )
  .option(
    "--region, --region <value>",
    "AWS Region defaults to `us-east-1`",
    "us-east-1"
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

      return writeEnv(parsed, options.path, options.prepend);
    }
  } catch (err) {
    program.error(error(err));
  }
}

export function writeEnv(
  keyValuePairs: any,
  filePath: string,
  prepend: string
) {
  try {
    const envFile = path.resolve(filePath);
    const writeStream = fs.createWriteStream(envFile);

    Object.entries(keyValuePairs).map(([key, value]) => {
      console.log(info(`info: ${key}`));
      const v = `${prepend}${key.toUpperCase()}=${value}${`\n`}`;
      const exportString = v;

      writeStream.write(exportString);
    });

    console.log(info(`info: writing to ${envFile}`));
    console.log(info("info: done"));
  } catch (err) {
    program.error(error(err));
  }
}
