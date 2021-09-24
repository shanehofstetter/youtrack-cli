import { YoutrackCliCommand } from "../command";
import { actionWrapper } from "../../utils/commander";
import chalk from "chalk";
import { printError } from "../../utils/errorHandler";
import { YoutrackClient } from "youtrack-rest-client";
import * as inquirer from "inquirer";

export class DeleteIssueCommand implements YoutrackCliCommand {

    private issueId: string = '';

    private getConfirmationQuestions() {
        return [
            {
                type: 'confirm',
                name: 'confirmDeletion',
                message: `Really delete Issue ${this.issueId}?`,
                default: true
            }
        ];
    }

    public execute(issueId: string, skipConfirmation: boolean): Promise<any> {
        this.issueId = issueId;

        return actionWrapper((client) => {
            if (!skipConfirmation) {
                return inquirer.prompt(this.getConfirmationQuestions()).then((answers: any) => {
                    if (!answers.confirmDeletion) {
                        return console.log(chalk.yellow('aborted'));
                    }
                    return this.deleteIssue(client);
                });
            }
            return this.deleteIssue(client);
        });
    }

    private deleteIssue(client: YoutrackClient): Promise<any> {
        return client.issues.delete(this.issueId).then(response => {
            console.log(chalk.green('issue deleted.'));
        }).catch(printError);
    }
}
