import {Command} from "commander";
import * as program from "commander";
import chalk from "chalk";

export function startCommander(knownSubCommands: string[] = []): Command {
    if (!process.argv.slice(2).length) {
        program.outputHelp((txt) => chalk.yellow(txt));
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
