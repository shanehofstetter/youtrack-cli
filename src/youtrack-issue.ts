import * as program from "commander";
import {actionWrapper, startCommander} from "./utils/commander";
import {RawPrinter, TablePrinter} from "./utils/printer";
import {Issue} from "youtrack-rest-client/dist/entities/issue";
import chalk from "chalk";
import {formatIssueFields} from "./utils/formatters/issueFormatter";
import {SearchIssuesCommand} from "./commands/issue/searchIssuesCommand";
import {printError} from "./utils/errorHandler";
import {DeleteIssueCommand} from "./commands/issue/deleteIssueCommand";
import {CommentPrinter} from "./utils/printers/commentPrinter";
import {TextRenderer} from "./utils/formatters/textRenderer";

program
    .command('find')
    .alias('f')
    .description('search issues by query (interactive)')
    .option('-r, --raw', 'print raw json')
    .option('-m, --max <max>', 'limit number of issues shown')
    .option('-f, --fields <field>', 'which fields to display', function (field, fields = []) {
        fields.push(field);
        return fields;
    })
    .action((...args) => {
        const cmd = args.pop();
        let fields = [...(cmd.fields || []), ...args];
        if (fields.length === 0) {
            fields = ['summary', 'Priority', 'Type', 'State'];
        }
        const filterOptions: any = {};
        if (cmd.max && cmd.max > 0) {
            filterOptions.max = cmd.max;
        }

        return new SearchIssuesCommand().execute(filterOptions, fields, cmd.raw);
    });

program
    .command('show <issueId>')
    .alias('s')
    .description('show issue info')
    .option('-r, --raw', 'print raw json')
    .action((issueId, args) => {
        return actionWrapper((client) => {
            return client.issues.byId(issueId).then((issue: Issue) => {
                if (args.raw) {
                    RawPrinter.print(issue);
                } else {
                    if (issue.field) {

                        const fields = formatIssueFields(issue.field, ['description']);

                        TablePrinter.print(fields, ['name', 'value'], {1: {width: 80}});

                        const descriptionField = issue.field.find(f => f.name === 'description');
                        if (descriptionField && typeof descriptionField.value === "string") {
                            console.log(chalk.bold(chalk.gray(chalk.underline('description:\n'))));
                            console.log(`${TextRenderer.render(descriptionField.value)}\n`);
                        }
                    }
                    if (issue.comment && issue.comment.length > 0) {
                        console.log(chalk.bold(chalk.gray(chalk.underline('comments:\n'))));

                        CommentPrinter.printComments(issue.comment, false);
                    }
                }
            }).catch(printError);
        });
    });

program
    .command('delete <issue>')
    .description('delete an issue by its id')
    .option('-y, --skip-confirmation', 'skip the confirmation')
    .alias('d')
    .action((issueId: string, args: any) => {
        return new DeleteIssueCommand().execute(issueId, args.skipConfirmation);
    });

startCommander();
