import chalk from "chalk";
import * as program from "commander";
import { Command } from "commander";
import { YoutrackClient } from "youtrack-rest-client/dist/youtrack";
import { CredentialStore } from "./credentialStore";
import { printError } from "./errorHandler";
import { YoutrackConfig } from "./youtrackConfig";

export function startCommander(knownSubCommands: string[] = []): Command {

    if (!process.argv.slice(2).length) {
        program.help((txt) => chalk.yellow(txt));
    }

    program.on('command:*', () => {
        if (knownSubCommands.indexOf(program.args[0]) === -1) {
            console.error(chalk.red('command not found: "%s"'), program.args.join(' '));
            console.info('See --help for a list of available commands.');
            process.exit(1);
        }
    });

    return program.parse(process.argv);
}

export function actionWrapper(fn: (client: YoutrackClient) => any): Promise<any> {
    return CredentialStore.ensureCredentialsPresent().then(() => {
        return new YoutrackConfig().getYoutrackInstance().then((client) => {
            return fn(client);
        }).catch(printError);
    });
}
