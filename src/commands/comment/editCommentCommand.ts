import { YoutrackCliCommand } from "../command";
import chalk from "chalk";
import { YoutrackClient } from "youtrack-rest-client";
import { actionWrapper } from "../../utils/commander";
import * as inquirer from "inquirer";
import { printError } from "../../utils/errorHandler";

export class EditCommentCommand implements YoutrackCliCommand {

    private getQuestions(client: YoutrackClient) {
        return [
            {
                type: 'input',
                name: 'issueId',
                message: 'Issue ID:',
                validate: (issueId: any) => {
                    return client.issues.byId(issueId)
                        .then(exists => true)
                        .catch(() => {
                            return chalk.red(`issue ${issueId} does not exist`);
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
            },
            {
                type: 'input',
                name: 'comment',
                message: 'Comment:',
                validate: (commentId: any) => {
                    if (commentId.length >= 1) {
                        return true;
                    }
                    return chalk.red('please provide a non-empty comment');
                }
            }
        ]
    };

    public execute(...args: any[]): any {
        return actionWrapper((client) => {
            return inquirer.prompt(this.getQuestions(client)).then((answers: any) => {
                return client.comments.update(answers.issueId, {
                    id: answers.commentId,
                    text: answers.comment
                }).then(response => {
                    console.log(chalk.green(`updated Comment ${answers.commentId}`));
                }).catch(printError);
            });
        });
    }
}