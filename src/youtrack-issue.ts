import * as program from "commander";
import {actionWrapper, startCommander} from "./utils/commander";
import {printObject, RawPrinter, TablePrinter, toDateString} from "./utils/printer";
import {Field, Issue} from "youtrack-rest-client/dist/entities/issue";
import chalk from "chalk";
import * as inquirer from "inquirer";

const columnConfig = {
    0: {
        width: 30
    },
    2: {
        width: 30
    }
};

const attributes = ['id'];


function formatIssueFields(fields: Field[]) {
    return fields.map(f => {
        const {...field}: any = f;

        if (['created', 'updated'].indexOf(field.name) >= 0 && typeof field.value === 'string') {
            field.value = toDateString(field.value);
        }
        if (Array.isArray(field.value) && field.value.length == 1 && typeof field.value[0] === 'object') {
            field.value = field.value[0].value;
        }

        if ("color" in field && !!field.color) {
            const prevLevel = chalk.level;
            chalk.level = 1;

            if (field.color.bg) {
                field.value = chalk.hex(field.color.bg)(field.value);
            }
            if (field.color.fg) {
                field.value = chalk.hex(field.color.fg)(field.value);
            }

            chalk.level = prevLevel;
        }

        field.name = chalk.bold(f.name);

        return field;
    });
}

// TODO: add 'max' option (default = none)
program
    .command('find')
    .alias('f')
    .description('search issues with a query (starts prompt)')
    .option('-r, --raw', 'print raw json')
    .option('-f, --fields <file>', 'which fields to display', function(field, fields = []) {
        fields.push(field);
        return fields;
    })
    .action((...args) => {
        const cmd = args.pop();
        let fields = [...(cmd.fields || []), ...args];
        if (fields.length === 0) {
            fields = ['summary', 'Priority', 'Type', 'State'];
        }

        return actionWrapper((client) => {
            const queryPrompt = [{
                type: 'input',
                name: 'query',
                message: 'Query:',
                validate: (query: any) => {
                    if (query.length >= 1) {
                        return true;
                    }
                    return chalk.red('please provide a valid search-query');
                }
            }];

            return inquirer.prompt(queryPrompt).then((answers: any) => {
                return client.issues.search(answers.query).then(issues => {

                    const fieldNames: Set<string> = new Set();

                    const formattedIssues = issues.map(i => {
                        const issue: any = {id: i.id};
                        if (i.field) {
                            const formattedFields = formatIssueFields(i.field.filter(f => fields.indexOf(f.name) >= 0 ));
                            formattedFields.forEach(f => {
                                issue[f.name] = f.value;
                                fieldNames.add(f.name);
                            });
                        }
                        return issue;
                    });

                    printObject(formattedIssues, {
                        raw: cmd.raw,
                        attributes: ['id', ...Array.from(fieldNames)],
                        columnOptions: {}
                    });
                });
            });
        });
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
                    TablePrinter.print([issue], attributes, columnConfig);
                    if (issue.field) {
                        console.log(chalk.gray('fields:'));
                        const fields = formatIssueFields(issue.field);

                        TablePrinter.print(fields, ['name', 'value'], {1: {width: 80}});
                    }
                    if (issue.comment) {
                        console.log(chalk.gray('comments:'));

                        const comments = issue.comment.map(c => {
                            return {...c, created: toDateString(c.created)};
                        });

                        TablePrinter.print(comments, ['author', 'text', 'created', 'deleted'], {1: {width: 40}});
                    }
                }
            });
        });
    });

startCommander();
