import {Comment} from "youtrack-rest-client";
import {RawPrinter, TablePrinter, toDateString} from "../printer";

export class CommentPrinter {
    public static printComments(comments: Comment[], raw: boolean = false) {
        if (raw) {
            return RawPrinter.print(comments);
        }

        const formattedComments = comments.map(c => {
            return {...c, created: toDateString(c.created)};
        });

        TablePrinter.print(formattedComments, ['id', 'author', 'text', 'created', 'deleted'], {2: {width: 40}});
    }
}