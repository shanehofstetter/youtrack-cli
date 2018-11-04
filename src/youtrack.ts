import * as program from 'commander';
import {startCommander} from "./utils/commander";
import {SetupCommand} from "./commands/setupCommand";
import {PackageInformation} from "./utils/packageInformation";

program.version(PackageInformation.get().version);

program
    .command('project')
    .description('project command description')
    .alias('p');

program
    .command('setup')
    .description('setup youtrack cli')
    .action(() => {
        new SetupCommand().execute();
    });

startCommander(['project', 'p']);
