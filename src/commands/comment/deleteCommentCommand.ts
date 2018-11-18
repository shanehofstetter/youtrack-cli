import {YoutrackCliCommand} from "../command";
import chalk from "chalk";
import {YoutrackClient} from "youtrack-rest-client";
import {actionWrapper} from "../../utils/commander";
import * as inquirer from "inquirer";
import {printError} from "../../utils/errorHandler";

export class DeleteCommentCommand implements YoutrackCliCommand {

    private getQuestions(client: YoutrackClient) {
        return [
            {
                type: 'input',
                name: 'issueId',
                message: 'Issue ID:',
                validate: (issueId: any) => {
                    return client.issues.exists(issueId).then(exists => {
                        if (!exists) {
                            return chalk.red(`issue ${issueId} does not exist`);
                        }
                        return true;
                    });
                }
            },
            {
                type: 'input',
                name: 'commentId',
                message: 'Comment ID:',
                validate: (commentId: any) => {
                    if (commentId.length >= 1) {
                        return true;
                    }
                    return chalk.red('please provide a valid Comment ID');
                }
            }
        ]
    };

    public execute(...args: any[]): any {
        return actionWrapper((client) => {
            return inquirer.prompt(this.getQuestions(client)).then((answers: any) => {
                return client.comments.delete(answers.issueId, answers.commentId).then(response => {
                    console.log(chalk.green(`deleted Comment ${answers.commentId}`));
                }).catch(printError);
            });
        });
    }
}