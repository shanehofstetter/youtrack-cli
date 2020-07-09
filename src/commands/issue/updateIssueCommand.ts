import {YoutrackCliCommand} from "../command";
import chalk from "chalk";
import {actionWrapper} from "../../utils/commander";
import {printError} from "../../utils/errorHandler";
import {YoutrackClient, Issue} from "youtrack-rest-client";
import * as inquirer from "inquirer";

export class UpdateIssueCommand implements YoutrackCliCommand {

    private getIssuePrompt(client: YoutrackClient): inquirer.Question[]{
        return [
            {
                type: 'list',
                name: 'field',
                message: 'Field:',
                choices: ['State', 'Description', 'Summary (Title)', 'Assignee'],
            },
            {
                type: 'input',
                name: 'description',
                message: 'New description: ',
                when: (answers: any) => {
                    return answers.field === 'Description';
                },
            },
            {
                type: 'input',
                name: 'state',
                message: 'New state: ',
                when: (answers: any) => {
                    return answers.field === 'State';
                },
            },
            {
                type: 'input',
                name: 'summary',
                message: 'New summary (Title): ',
                when: (answers: any) => {
                    return answers.field === 'Summary (Title)';
                },
            },
            {
                type: 'input',
                name: 'assignee',
                message: 'New assignee: ',
                when: (answers: any) => {
                    return answers.field === 'Assignee';
                },
            }
        ];
    }

    execute(issueId: string) {
        return actionWrapper((client: YoutrackClient) => {
            return inquirer.prompt(this.getIssuePrompt(client)).then((answers: inquirer.Answers) => {
                const issueObject = {id: issueId};
                answers.forEach((answer: any) => {
                    if (answer.when) {
                        (issueObject as any)[answer.name] = answers[answer.name];
                    }
                });
                // TODO uncomment if latest version of youtrack-rest-client can be used.
                // client.issues.update(issueObject);
            });
        });
    }
}