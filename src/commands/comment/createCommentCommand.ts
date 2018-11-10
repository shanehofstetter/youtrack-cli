import {YoutrackCliCommand} from "../command";
import {YoutrackClient} from "youtrack-rest-client";
import chalk from "chalk";
import {actionWrapper} from "../../utils/commander";
import {handleError} from "../../utils/errorHandler";
import * as inquirer from "inquirer";

export class CreateCommentCommand implements YoutrackCliCommand {

    private getQueryPrompt(client: YoutrackClient) {
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
                name: 'comment',
                message: 'Comment:',
                validate: (comment: string) => {
                    if (comment.length > 0) {
                        return true;
                    }
                    return chalk.red('comment may not be empty');
                }
            }
        ]
    }

    public execute(commentParameters: any): Promise<any> {
        return actionWrapper((client) => {
            if (commentParameters.issueId && commentParameters.comment) {
                return this.createComment(client, commentParameters.issueId, commentParameters.comment);
            }
            return inquirer.prompt(this.getQueryPrompt(client)).then((answers: any) => {
                return this.createComment(client, answers.issueId, answers.comment);
            });
        });
    }

    private createComment(client: YoutrackClient, issueId: string, comment: string): Promise<any> {
        return client.comments.create(issueId, comment).then(() => {
            console.log(chalk.green(`comment created.`))
        }).catch(handleError);
    }
}
