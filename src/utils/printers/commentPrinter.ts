import { RawPrinter, toDateString } from "../printer";
import chalk from "chalk";
import { TextRenderer } from "../formatters/textRenderer";
import { IssueComment } from "youtrack-rest-client";

export class CommentPrinter {
    public static printComments(comments: IssueComment[], raw: boolean = false) {
        if (raw) {
            return RawPrinter.print(comments);
        }

        const formattedComments = comments.filter(c => !c.deleted).map(c => {
            return { ...c, created: toDateString(<number>c.created) };
        });

        for (let comment of formattedComments) {
            console.log(chalk.bold(chalk.gray(`${comment.author} on ${comment.created} (#${comment.id}):`)));
            console.log(`${TextRenderer.render(<string>comment.text)}\n`)
        }
    }
}
