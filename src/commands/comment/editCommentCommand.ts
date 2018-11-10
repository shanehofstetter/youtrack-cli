import {YoutrackCliCommand} from "../command";
import chalk from "chalk";
import {YoutrackClient} from "youtrack-rest-client";
import {actionWrapper} from "../../utils/commander";
import * as inquirer from "inquirer";
import {handleError} from "../../utils/errorHandler";

export class EditCommentCommand implements YoutrackCliCommand {

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
                return client.comments.update(answers.issueId, answers.commentId, answers.comment).then(response => {
                    console.log(chalk.green(`updated Comment ${answers.commentId}`));
                }).catch(handleError);
            });
        });
    }
}