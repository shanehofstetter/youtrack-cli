import * as program from "commander";
import {actionWrapper, startCommander} from "./utils/commander";
import {RawPrinter, TablePrinter, toDateString} from "./utils/printer";
import {Issue} from "youtrack-rest-client/dist/entities/issue";
import chalk from "chalk";
import {formatIssueFields} from "./utils/formatters/issueFormatter";
import {SearchIssuesCommand} from "./commands/searchIssuesCommand";
import {handleError} from "./utils/errorHandler";

const columnConfig = {
    0: {
        width: 30
    },
    2: {
        width: 30
    }
};

program
    .command('find')
    .alias('f')
    .description('search issues by query (starts prompt)')
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
                        const fields = formatIssueFields(issue.field);

                        TablePrinter.print(fields, ['name', 'value'], {1: {width: 80}});
                    }
                    if (issue.comment && issue.comment.length > 0) {
                        console.log(chalk.gray('comments:'));

                        const comments = issue.comment.map(c => {
                            return {...c, created: toDateString(c.created)};
                        });

                        TablePrinter.print(comments, ['author', 'text', 'created', 'deleted'], {1: {width: 40}});
                    }
                }
            }).catch(handleError);
        });
    });

startCommander();
