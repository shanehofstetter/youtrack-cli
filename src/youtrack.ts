import * as program from 'commander';
import { Command } from 'commander';
import { startCommander } from "./utils/commander";
import { SetupCommand } from "./commands/setupCommand";
import { PackageInformation } from "./utils/packageInformation";

const updateNotifier = require('update-notifier');

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
    },
    {
        command: 'comment',
        description: 'manage issue comment',
        alias: 'c'
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


updateNotifier({ pkg: PackageInformation.get() }).notify({ isGlobal: true });

startCommander([].concat(...<[]>subCommands.map((c) => [c.command, c.alias])));
