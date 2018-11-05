import * as program from "commander";
import {actionWrapper, startCommander} from "./utils/commander";
import {User} from "youtrack-rest-client/dist/entities/user";
import {printObject} from "./utils/printer";
import {handleError} from "./utils/errorHandler";

const columnConfig = {
    0: {
        width: 30
    },
    2: {
        width: 30
    }
};

const attributes = ['login', 'email', 'fullName'];

program
    .command('info')
    .alias('i')
    .description('show info about current user')
    .option('-r, --raw', 'print raw json')
    .action((args) => {
        return actionWrapper((client) => {
            return client.users.current().then((user: User) => {
                printObject(user, {
                    raw: args.raw, columnConfig, attributes
                });
            }).catch(handleError);;
        });
    });

program
    .command('show <login>')
    .description('show info about user')
    .option('-r, --raw', 'print raw json')
    .action((login, args) => {
        return actionWrapper((client) => {
            return client.users.byName(login).then((user: User) => {
                printObject(user, {
                    raw: args.raw, columnConfig, attributes
                });
            }).catch(handleError);
        });
    });

startCommander();
