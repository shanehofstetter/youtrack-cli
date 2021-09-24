import * as program from "commander";
import { actionWrapper, startCommander } from "./utils/commander";
import { RawPrinter, TablePrinter } from "./utils/printer";
import { Issue } from "youtrack-rest-client/dist/entities/issue";
import chalk from "chalk";
import { formatIssueFields } from "./utils/formatters/issueFormatter";
import { SearchIssuesCommand } from "./commands/issue/searchIssuesCommand";
import { printError } from "./utils/errorHandler";
import { DeleteIssueCommand } from "./commands/issue/deleteIssueCommand";
import { CreateIssueCommand } from "./commands/issue/createIssueCommand";
import { CommentPrinter } from "./utils/printers/commentPrinter";
import { TextRenderer } from "./utils/formatters/textRenderer";

program
    .command('find')
    .alias('f')
    .description('search issues by query (interactive)')
    .option('-q, --query <query>', 'non-interactive query')
    .option('-r, --raw', 'print raw json')
    .option('-m, --max <max>', 'limit number of issues shown')
    .action((...args) => {
        const cmd = args.pop();
        // TODO: fetch more issue fields and display them too
        // const fields = ['summary', 'Priority', 'Type', 'State'];
        const fields = ['summary', 'description'];
        const filterOptions: any = {};
        if (cmd.max && cmd.max > 0) {
            filterOptions.max = cmd.max;
        }
        return new SearchIssuesCommand().execute(filterOptions, fields, cmd.raw, cmd.query);
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
                    if (issue.fields) {
                        const fields = formatIssueFields(issue.fields, ['description']);

                        TablePrinter.print(fields, ['name', 'value'], { 1: { width: 80 } });

                        console.log(chalk.bold(chalk.gray(chalk.underline('description:\n'))));
                        console.log(`${TextRenderer.render(issue.description || '-')}\n`);
                    }
                    console.log(chalk.bold(chalk.gray(chalk.underline('comments:\n'))));
                    if (issue.comments && issue.comments.length > 0) {
                        CommentPrinter.printComments(issue.comments, false);
                    } else {
                        console.log('-')
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

program
    .command('create')
    .description('creates an issue (interactive)')
    .alias('c')
    .action(() => {
        return new CreateIssueCommand().execute();
    });

startCommander();
