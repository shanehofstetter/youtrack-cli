import {YoutrackCliCommand} from "../command";
import {actionWrapper} from "../../utils/commander";
import chalk from "chalk";
import * as inquirer from "inquirer";
import {printObject} from "../../utils/printer";
import {formatIssueFields} from "../../utils/formatters/issueFormatter";
import {handleError} from "../../utils/errorHandler";

export class SearchIssuesCommand implements YoutrackCliCommand {

    private queryPrompt = [{
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

    public execute(filterOptions: {}, fields: string[], raw: boolean): Promise<any> {
        return actionWrapper((client) => {
            return inquirer.prompt(this.queryPrompt).then((answers: any) => {
                return client.issues.search(answers.query, filterOptions).then(issues => {

                    const fieldNames: Set<string> = new Set();

                    const formattedIssues = issues.map(i => {
                        const issue: any = {id: i.id};
                        if (i.field) {
                            const formattedFields = formatIssueFields(i.field.filter(f => fields.indexOf(f.name) >= 0));
                            formattedFields.forEach(f => {
                                issue[f.name] = f.value;
                                fieldNames.add(f.name);
                            });
                        }
                        return issue;
                    });

                    printObject(formattedIssues, {
                        raw,
                        attributes: ['id', ...Array.from(fieldNames)],
                        columnConfig: {
                            1: {
                                width: 50
                            }
                        }
                    });
                }).catch(handleError);
            });
        });
    }
}