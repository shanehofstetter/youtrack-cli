import * as program from "commander";
import { actionWrapper, startCommander } from "./utils/commander";
import { printObject, RawPrinter, toDateString } from "./utils/printer";
import { WorkItem } from "youtrack-rest-client/dist/entities/workItem";
import { printError } from "./utils/errorHandler";
import { CreateWorkItemCommand } from "./commands/workitem/createWorkItemCommand";
import { DeleteWorkItemCommand } from "./commands/workitem/deleteWorkItemCommand";
import { EditWorkItemCommand } from "./commands/workitem/editWorkItemCommand";

program
    .command('list <issueId>')
    .description('list all work items of an issue')
    .alias('ls')
    .option('-r, --raw', 'print raw json')
    .action((issueId, args) => {
        return actionWrapper((client) => {
            return client.workItems.all(issueId).then((workItems: WorkItem[]) => {

                if (args.raw) {
                    return RawPrinter.print(workItems);
                }

                const formattedWorkItems = workItems.sort((a, b) => <number>a.date - <number>b.date).map(workItem => {
                    const formattedWorkItem: any = { ...workItem, date: toDateString(<number>workItem.date, false) };
                    if (workItem.author) {
                        formattedWorkItem.author = workItem.author.login;
                    }
                    formattedWorkItem.worktype = workItem.type ? workItem.type.name : '';
                    formattedWorkItem.duration = workItem.duration && workItem.duration.presentation;
                    return formattedWorkItem;
                });

                printObject(formattedWorkItems, {
                    columnConfig: {
                        0: {
                            width: 10
                        },
                        1: {
                            width: 15
                        },
                        2: {
                            width: 15
                        },
                        3: {
                            width: 50
                        }
                    },
                    attributes: ['id', 'date', 'duration', 'description', 'worktype', 'author']
                });
            }).catch(printError);
        });
    });

program
    .command('create')
    .description('create new work item for an issue in interactive mode. if all parameters are given via options, interactive mode is skipped.')
    .alias('c')
    .option('-i, --issue <issue>', 'issue id')
    .option('-d, --duration <duration>', 'duration (e.g. "1h 30m")')
    .option('--date <date>', 'date')
    .option('-w, --worktype <worktype>', 'work-type')
    .option('--desc, --description <description>', 'description')
    .option('-r, --raw', 'print raw json')
    .action((args) => {
        const workItemParameters = {
            issueId: args.issue,
            duration: args.duration,
            date: args.date,
            worktype: args.worktype,
            description: args.description,
        };

        return new CreateWorkItemCommand().execute(args.raw, workItemParameters);
    });


program
    .command('delete')
    .description('delete work item of an issue (interactive)')
    .alias('d')
    .action(() => {
        return new DeleteWorkItemCommand().execute();
    });

program
    .command('edit')
    .description('edit work item of an issue (interactive)')
    .alias('e')
    .action(() => {
        return new EditWorkItemCommand().execute();
    });

startCommander();
