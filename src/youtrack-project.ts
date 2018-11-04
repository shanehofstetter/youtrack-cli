import * as program from "commander";
import {startCommander} from "./utils/commander";
import {CredentialStore} from "./utils/credentialStore";
import {YoutrackConfig} from "./utils/youtrackConfig";
import {RawPrinter, TablePrinter} from "./utils/printer";
import {Project} from "youtrack-rest-client/dist/entities/project";

program
    .command('list')
    .alias('ls')
    .description('list all accessible projects')
    .option('-r, --raw', 'print raw json')
    .option('-d, --desc', 'print description (does not apply when option --raw is used')
    .action(async (args) => {
        await CredentialStore.ensureCredentialsPresent();
        new YoutrackConfig().getYoutrackInstance().then(client => {
            client.projects.all().then((projects: Project[]) => {
                if (args.raw) {
                    RawPrinter.print(projects);
                } else {
                    const attributes = ['shortName', 'name', 'description'].filter(a => args.desc || a !== 'description');
                    TablePrinter.print(projects, attributes, {
                        0: {
                            width: 15
                        },
                        2: {
                            width: 50
                        }
                    });
                }
            })
        });
    });

startCommander();
