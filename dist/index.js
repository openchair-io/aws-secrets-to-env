#! /usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeEnv = exports.execute = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const client_secrets_manager_1 = require("@aws-sdk/client-secrets-manager");
const figlet_1 = __importDefault(require("figlet"));
const commander_1 = require("commander");
const cli_color_1 = __importDefault(require("cli-color"));
const program = new commander_1.Command();
const error = cli_color_1.default.redBright.bold;
const info = cli_color_1.default.greenBright.bold;
console.log(`${figlet_1.default.textSync("openchair . io")}${"\n"}`);
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
    .option("--region, --region <value>", "AWS Region defaults to `us-east-1`", "us-east-1")
    .option("--access-key-id, --access-key-id <value>", "AWS client id by default looks for AWS_ACCESS_KEY_ID set in the envirnment")
    .option("--secret-access-key, --secret-access-key <value>", "AWS secret access key by default looks for AWS_SECRET_ACCESS_KEY set in the envirnment")
    .action(execute);
program.parse(process.argv);
function execute(secretId, options) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log(info("info: starting"));
            const client = new client_secrets_manager_1.SecretsManagerClient({ region: options.region });
            const command = new client_secrets_manager_1.GetSecretValueCommand({ SecretId: secretId });
            const response = yield client.send(command);
            if (response.SecretString) {
                console.log(info(`info: fetched secret${"\n"}`));
                const parsed = JSON.parse(response.SecretString);
                return writeEnv(parsed, options.path);
            }
        }
        catch (err) {
            program.error(error(err));
        }
    });
}
exports.execute = execute;
function writeEnv(keyValuePairs, filePath) {
    try {
        const envFile = path_1.default.resolve(filePath);
        const writeStream = fs_1.default.createWriteStream(envFile);
        Object.entries(keyValuePairs).map(([key, value]) => {
            console.log(info(`info: ${key}`));
            const v = `export ${key.toUpperCase()}=${value}${`\n`}`;
            const exportString = v;
            console.log(info(exportString));
            writeStream.write(exportString);
        });
        console.log(info(`info: writing to ${envFile}`));
        console.log(info("info: done"));
    }
    catch (err) {
        program.error(error(err));
    }
}
exports.writeEnv = writeEnv;
//# sourceMappingURL=index.js.map