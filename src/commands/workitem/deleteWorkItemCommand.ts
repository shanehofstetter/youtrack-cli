import {YoutrackCliCommand} from "../commands";
import chalk from "chalk";
import {actionWrapper} from "../../utils/commander";
import * as inquirer from "inquirer";
import {handleError} from "../../utils/errorHandler";

export class DeleteWorkItemCommand implements YoutrackCliCommand {

    private questions = [
        {
            type: 'input',
            name: 'issueId',
            message: 'Issue ID:',
            validate: (issueId: any) => {
                if (issueId.length >= 1) {
                    return true;
                }
                return chalk.red('please provide a valid Issue ID');
            }
        },
        {
            type: 'input',
            name: 'workItemId',
            message: 'Work-Item ID:',
            validate: (workItemId: any) => {
                if (workItemId.length >= 1) {
                    return true;
                }
                return chalk.red('please provide a valid Work-Item ID');
            }
        }
    ];

    public execute(): Promise<any> {
        return actionWrapper((client) => {
            return inquirer.prompt(this.questions).then((answers: any) => {
                return client.workItems.delete(answers.issueId, answers.workItemId).then(issues => {
                    console.log(chalk.green(`deleted Work-Item ${answers.workItemId}`));
                }).catch(handleError);
            });
        });
    }
}