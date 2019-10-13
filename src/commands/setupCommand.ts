import chalk from "chalk";
import * as inquirer from "inquirer";
import {Youtrack, YoutrackClient} from "youtrack-rest-client";
import {configStore} from "../utils/configStore";
import {CredentialStore} from "../utils/credentialStore";
import {getFormattedErrorMessage} from "../utils/errorHandler";
import {youtrackConfig} from "../utils/youtrackConfig";
import {YoutrackCliCommand} from "./command";

// tslint:disable-next-line
const validUrl = require('valid-url');

export class SetupCommand implements YoutrackCliCommand {

    private readonly setupQuestions = [
        {
            message: 'Youtrack Url (e.g. "https://your-organisation.myjetbrains.com/youtrack"',
            name: 'base_url',
            type: 'input',
            validate: (url: string) => {
                if (validUrl.isUri(url)) {
                    return true;
                }
                return `${url} does not seem to be a valid URL. Did you include the scheme (http/https)?`;
            },
        },
        {
            choices: [{
                name: 'Username/Password',
                value: "credentials",
            }, {
                name: 'Permanent Token',
                value: 'token',
            }],
            message: 'Please select your preferred authentication type:',
            name: 'authentication_type',
            type: 'list',
        },
        {
            message: 'Username:',
            name: 'username',
            type: 'input',
            when: (answers: any) => {
                return answers.authentication_type === 'credentials';
            },
        },
        {
            message: 'Password:',
            name: 'password',
            type: 'password',
            when: (answers: any) => {
                return answers.authentication_type === 'credentials';
            },
        },
        {
            message: 'Permanent Token:',
            name: 'token',
            type: 'password',
            when: (answers: any) => {
                return answers.authentication_type === 'token';
            },
        },
    ];

    private readonly confirm = [
        {
            message: 'You already configured the cli, do you really want to override the previous configuration?',
            name: 'override',
            type: 'confirm',
        },
    ];

    public execute(args = []): any {
        if (configStore.get('base_url')) {
            inquirer.prompt(this.confirm).then((answers: any) => {
                if (!answers.override) {
                    console.log(chalk.green('nothing changed.'));
                    process.exit(0);
                }
            }).then(() => {
                this.runSetup();
            });
        } else {
            this.runSetup();
        }
    }

    private runSetup(): void {
        inquirer.prompt(this.setupQuestions).then((answers) => {
            this.storeConfig(answers).then(() => {
                this.checkAccess().then((client) => {
                    this.storeTimeTrackingConfig(client).then(() => {
                        this.complete();
                    });
                }).catch(() => this.fail());
            });
        });
    }

    private storeTimeTrackingConfig(client: YoutrackClient): Promise<void> {
        return Promise.resolve(client.get('/admin/timetracking').then((response) => {
            youtrackConfig.setTimeTrackingConfig(response);
            return Promise.resolve();
        }).catch((error) => {
            const timetrackingConfig = youtrackConfig.getTimeTrackingConfig();
            console.log(chalk.yellow(`could not get timetracking configuration (most probably because you lack permissions), using defaults (${timetrackingConfig.hoursADay}h per day, ${timetrackingConfig.daysAWeek} days per week)`));
            return Promise.resolve();
        }));
    }

    private storeConfig(answers: { [key: string]: any }): Promise<any> {
        configStore.set('base_url', answers.base_url);
        configStore.set('authentication_type', answers.authentication_type);
        if (answers.authentication_type === 'token') {
            return CredentialStore.set('token', answers.token);
        } else {
            return CredentialStore.set(answers.username, answers.password);
        }
    }

    private checkAccess(): Promise<YoutrackClient> {
        return youtrackConfig.get().then((config) => {
            if (config === null) {
                console.error(chalk.red('configuration seems to be invalid. try to run setup again.'));
                return Promise.reject();
            }
            return new Youtrack(config).login().then((client) => {
                if ("password" in config) {
                    console.log(chalk.green('login successful.'));
                    return Promise.resolve(client);
                }
                return client.users.current().then(() => {
                    console.log(chalk.green('authentication was successful.'));
                    return Promise.resolve(client);
                });
            });
        }).catch((error) => {
            console.error(chalk.red('problem occurred while connecting to youtrack:', getFormattedErrorMessage(error)));
            return Promise.reject();
        });
    }

    private fail() {
        console.error(chalk.red('setup failed.'));
    }

    private complete() {
        console.log(chalk.green('setup complete.'));
    }
}
