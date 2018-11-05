import * as program from 'commander';
import {startCommander} from "./utils/commander";
import {SetupCommand} from "./commands/setupCommand";
import {PackageInformation} from "./utils/packageInformation";
import {Command} from "commander";

program.version(PackageInformation.get().version);

const subCommands = [
    {
        command: 'project',
        description: 'manage projects',
        alias: 'p'
    },
    {
        command: 'user',
        description: 'manage users',
        alias: 'u'
    },
    {
        command: 'issue',
        description: 'manage issues',
        alias: 'i'
    },
    {
        command: 'workitem',
        description: 'manage workitems',
        alias: 'w'
    }
];

const commands: Command[] = [];

subCommands.forEach((command) => {
    commands.push(program
        .command(command.command, command.description)
        .alias(command.alias));
});

program
    .command('setup')
    .description('setup youtrack cli')
    .action(() => {
        new SetupCommand().execute();
    });

startCommander([].concat.apply([], subCommands.map((c) => [c.command, c.alias])));
