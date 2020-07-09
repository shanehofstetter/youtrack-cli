import { YoutrackCliCommand } from "../command";
import { actionWrapper } from "../../utils/commander";
import chalk from "chalk";
import * as inquirer from "inquirer";
import { printObject } from "../../utils/printer";
import { printError } from "../../utils/errorHandler";
import { ReducedIssue, YoutrackClient } from "youtrack-rest-client";

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

    private printIssues(filterOptions: {}, fields: string[], raw: boolean, query: string, client: YoutrackClient) {
        return client.issues.search(query, filterOptions).then((issues: ReducedIssue[]) => {

            const formattedIssues = issues.map(i => ({
                humanId: `${i.project && i.project.shortName}-${i.numberInProject}`,
                ...i
            }));

            printObject(formattedIssues, {
                raw,
                attributes: ['humanId', ...fields],
                columnConfig: {
                    1: {
                        width: 50
                    }
                }
            });
        }).catch(printError);
    }

    public execute(filterOptions: {}, fields: string[], raw: boolean, query: string): Promise<any> {
        return actionWrapper((client) => {
            if (query) {
                return this.printIssues(filterOptions, fields, raw, query, client);
            }
            return inquirer.prompt(this.queryPrompt).then((answers: any) => {
                return this.printIssues(filterOptions, fields, raw, answers.query, client);
            });
        });
    }
}