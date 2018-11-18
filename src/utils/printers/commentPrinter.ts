import {Comment} from "youtrack-rest-client";
import {RawPrinter, toDateString} from "../printer";
import chalk from "chalk";
import {formatTextContent} from "../formatters/issueFormatter";

export class CommentPrinter {
    public static printComments(comments: Comment[], raw: boolean = false) {
        if (raw) {
            return RawPrinter.print(comments);
        }

        const formattedComments = comments.map(c => {
            return {...c, created: toDateString(c.created)};
        });

        for (let comment of formattedComments) {
            console.log(chalk.bold(chalk.gray(`${comment.author} on ${comment.created} (#${comment.id}):`)));
            console.log(`${formatTextContent(comment.text)}\n`)
        }
    }
}
