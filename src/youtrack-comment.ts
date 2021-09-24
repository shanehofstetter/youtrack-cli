import * as program from "commander";
import { actionWrapper, startCommander } from "./utils/commander";
import { printError } from "./utils/errorHandler";
import { CommentPrinter } from "./utils/printers/commentPrinter";
import { CreateCommentCommand } from "./commands/comment/createCommentCommand";
import { DeleteCommentCommand } from "./commands/comment/deleteCommentCommand";
import { EditCommentCommand } from "./commands/comment/editCommentCommand";
import { IssueComment } from "youtrack-rest-client";

program
    .command('list <issueId>')
    .description('list all comments of an issue')
    .alias('ls')
    .option('-r, --raw', 'print raw json')
    .action((issueId, args) => {
        return actionWrapper((client) => {
            return client.comments.all(issueId).then((comments: IssueComment[]) => {
                CommentPrinter.printComments(comments, args.raw);
            }).catch(printError);
        });
    });

program
    .command('create')
    .description('add comment to an issue. starts interactive mode if parameters are omitted.')
    .alias('c')
    .option('-i, --issue <issue>', 'issue id')
    .option('-c, --comment <comment>', 'comment text')
    .action((args) => {
        const commentParameters = {
            issueId: args.issue,
            comment: args.comment,
        };

        return new CreateCommentCommand().execute(commentParameters);
    });

program
    .command('delete')
    .description('delete a comment (interactive)')
    .alias('d')
    .action(() => {
        return new DeleteCommentCommand().execute();
    });

program
    .command('edit')
    .description('update a comment (interactive)')
    .alias('e')
    .action(() => {
        return new EditCommentCommand().execute();
    });

startCommander();
