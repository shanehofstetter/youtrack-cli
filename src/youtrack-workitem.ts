import * as program from "commander";
import {actionWrapper, startCommander} from "./utils/commander";
import {printObject, RawPrinter, toDateString} from "./utils/printer";
import {WorkItem} from "youtrack-rest-client/dist/entities/workItem";
import {handleError} from "./utils/errorHandler";
import {formatDuration} from "./utils/formatters/durationFormatter";
import {CreateWorkItemCommand} from "./commands/workitem/createWorkItemCommand";
import {DeleteWorkItemCommand} from "./commands/workitem/deleteWorkItemCommand";
import {EditWorkItemCommand} from "./commands/workitem/editWorkItemCommand";

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

                const formattedWorkItems = workItems.sort((a, b) => a.date - b.date).map(workItem => {
                    const formattedWorkItem: any = {...workItem, date: toDateString(workItem.date, false)};
                    if (workItem.author) {
                        formattedWorkItem.author = workItem.author.login;
                    }
                    formattedWorkItem.worktype = workItem.worktype.name;
                    formattedWorkItem.duration = formatDuration(workItem.duration);
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
            }).catch(handleError);
        });
    });

program
    .command('create')
    .description('create new work item for an issue (opens prompt)')
    .alias('c')
    .option('-r, --raw', 'print raw json')
    .action((args) => {
        return new CreateWorkItemCommand().execute(args.raw);
    });


program
    .command('delete')
    .description('delete work item of an issue (opens prompt)')
    .alias('d')
    .action(() => {
        return new DeleteWorkItemCommand().execute();
    });

program
    .command('edit')
    .description('edit work item of an issue (opens prompt)')
    .alias('e')
    .action(() => {
        return new EditWorkItemCommand().execute();
    });

startCommander();
