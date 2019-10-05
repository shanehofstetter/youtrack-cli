import {YoutrackCliCommand} from "../command";
import chalk from "chalk";
import {actionWrapper} from "../../utils/commander";
import {printError} from "../../utils/errorHandler";
import {YoutrackClient} from "youtrack-rest-client";
import * as inquirer from "inquirer";

export class CreateIssueCommand implements YoutrackCliCommand {

    private readonly issueQuestions = [
        {
            type: 'input',
            name: 'project',
            message: 'ProjectId: ',
            validate: (projectId: any) => {
                if (projectId.length >= 1) {
                    return true;
                }
                return chalk.red('please provide a valid projectId');
            },
        },
        {
            type: 'input',
            name: 'summary',
            message: 'Summary (Title):',
            validate: (summary: any) => {
                if (summary.length >= 1) {
                    return true;
                }
                return chalk.red('please provide a valid summary');
            },
        },
        {
            type: 'input',
            name: 'description',
            message: 'Description:',
        },
        {
            type: 'input',
            name: 'assignee',
            message: 'Assignee:',
        },
        {
            type: 'input',
            name: 'type',
            message: 'Type:',
            validate: (type: string) => {
                if (type.length >= 1) {
                    return true;
                }
                return chalk.red('please provide a valid type');
            },
        }
    ];

    execute() {
        return actionWrapper((client: YoutrackClient) => {
            return inquirer.prompt(this.issueQuestions).then((answers: any) => {
                const issueObj = {
                    summary: answers.summary,
                    description: answers.description,
                    project: answers.project,
                    assignee: undefined,
                };
                if (answers.assignee === '') {
                    issueObj.assignee = answers.assignee;                    
                }
                client.issues.create(issueObj).then((issueId) => {
                    console.log(chalk.green(`new issue with id ${issueId} created.`));
                }).catch(printError);
            });
        });
    }
}