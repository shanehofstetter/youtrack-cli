import * as program from "commander";
import { actionWrapper, startCommander } from "./utils/commander";
import { printObject } from "./utils/printer";
import { ReducedProject } from "youtrack-rest-client/dist/entities/project";
import { printError } from "./utils/errorHandler";

program
    .command('list')
    .alias('ls')
    .description('list all accessible projects')
    .option('-r, --raw', 'print raw json')
    .option('-d, --desc', 'print description (does not apply when option --raw is used')
    .action((args) => {
        return actionWrapper((client) => {
            return client.projects.all().then((projects: ReducedProject[]) => {
                printObject(projects, {
                    columnConfig: {
                        0: {
                            width: 15
                        },
                        2: {
                            width: 50
                        }
                    },
                    raw: args.raw,
                    attributes: ['shortName', 'name', 'description'].filter(a => args.desc || a !== 'description')
                });
            }).catch(printError);
        });
    });

startCommander();
