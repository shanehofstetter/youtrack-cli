import {Comment} from "youtrack-rest-client";
import {RawPrinter, toDateString} from "../printer";
import chalk from "chalk";
import {TextRenderer} from "../formatters/textRenderer";

export class CommentPrinter {
    public static printComments(comments: Comment[], raw: boolean = false) {
        if (raw) {
            return RawPrinter.print(comments);
        }

        const formattedComments = comments.filter(c => !c.deleted).map(c => {
            return {...c, created: toDateString(c.created)};
        });

        for (let comment of formattedComments) {
            console.log(chalk.bold(chalk.gray(`${comment.author} on ${comment.created} (#${comment.id}):`)));
            console.log(`${TextRenderer.render(comment.text)}\n`)
        }
    }
}
