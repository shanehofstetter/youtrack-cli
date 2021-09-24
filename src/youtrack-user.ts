import * as program from "commander";
import { actionWrapper, startCommander } from "./utils/commander";
import { User } from "youtrack-rest-client/dist/entities/user";
import { printObject } from "./utils/printer";
import { printError } from "./utils/errorHandler";

const userColumnConfig = {
    0: {
        width: 30
    },
    2: {
        width: 30
    }
};

const visibleUserAttributes = ['login', 'email', 'fullName'];

program
    .command('info')
    .alias('i')
    .description('show info about current user')
    .option('-r, --raw', 'print raw json')
    .action((args) => {
        return actionWrapper((client) => {
            return client.users.current().then((user: User) => {
                printObject(user, {
                    raw: args.raw, columnConfig: userColumnConfig, attributes: visibleUserAttributes
                });
            }).catch(printError);
        });
    });

program
    .command('show <login>')
    .description('show info about user')
    .option('-r, --raw', 'print raw json')
    .action((login, args) => {
        return actionWrapper((client) => {
            return client.users.byId(login).then((user: User) => {
                printObject(user, {
                    raw: args.raw, columnConfig: userColumnConfig, attributes: visibleUserAttributes
                });
            }).catch(printError);
        });
    });

startCommander();
