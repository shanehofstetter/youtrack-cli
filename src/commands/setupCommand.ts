import * as Configstore from "configstore";
import * as inquirer from "inquirer";
import chalk from "chalk";
import {CredentialStore} from "../utils/credentialStore";
import {PackageInformation} from "../utils/packageInformation";
import {YoutrackConfig} from "../utils/youtrackConfig";
import {Youtrack} from "youtrack-rest-client";
import {YoutrackCliCommand} from "./commands";

const validUrl = require('valid-url');

export class SetupCommand implements YoutrackCliCommand {

    private config: Configstore;

    public constructor() {
        this.config = new Configstore(PackageInformation.get().name, {});
    }

    private readonly setupQuestions = [
        {
            type: 'input',
            name: 'base_url',
            message: 'Youtrack Url (e.g. "https://org.myjetbrains.com"',
            validate: (url: string) => {
                if (validUrl.isUri(url)) {
                    return true;
                }
                return `${url} does not seem to be a valid URL. Did you include the scheme (http/https)?`;
            }
        },
        {
            type: 'list',
            name: 'authentication_type',
            message: 'Please select your preferred authentication type:',
            choices: [{
                name: 'Username/Password',
                value: "credentials"
            }, {
                name: 'Permanent Token',
                value: 'token'
            }]
        },
        {
            type: 'input',
            name: 'username',
            message: 'Username:',
            when: (answers: any) => {
                return answers.authentication_type === 'credentials';
            }
        },
        {
            type: 'password',
            name: 'password',
            message: 'Password:',
            when: (answers: any) => {
                return answers.authentication_type === 'credentials';
            }
        },
        {
            type: 'password',
            name: 'token',
            message: 'Permanent Token:',
            when: (answers: any) => {
                return answers.authentication_type === 'token';
            }
        }
    ];

    private readonly confirm = [
        {
            type: 'confirm',
            name: 'override',
            message: 'You already configured the cli, do you really want to override the previous configuration?',
        }
    ];

    public execute(args = []): any {
        if (this.config.get('base_url')) {
            inquirer.prompt(this.confirm).then((answers: any) => {
                if (!answers.override) {
                    console.log(chalk.green('nothing changed.'));
                    process.exit(0);
                }
            }).then(() => {
                inquirer.prompt(this.setupQuestions).then(answers => {
                    this.storeConfig(answers).then(() => {
                        this.checkAccess().then(() => {
                            this.complete();
                        }).catch(() => this.fail());
                    });
                });
            });
        }
    }

    private storeConfig(answers: { [key: string]: any }): Promise<any> {
        this.config.set('base_url', answers.base_url);
        this.config.set('authentication_type', answers.authentication_type);
        if (answers.authentication_type === 'token') {
            return CredentialStore.set('token', answers.token);
        } else {
            return CredentialStore.set(answers.username, answers.password);
        }
    }

    private checkAccess(): Promise<any> {
        return new YoutrackConfig().get().then(config => {
            if (config === null) {
                console.error(chalk.red('configuration seems to be invalid. try to run setup again.'));
                return Promise.reject();
            }
            return new Youtrack(config).login().then(client => {
                if ("password" in config) {
                    console.log(chalk.green('login successful.'));
                    return true;
                }
                return client.users.current().then(() => {
                    console.log(chalk.green('authentication was successful.'));
                    return true;
                });
            });
        }).catch((error) => {
            console.error(chalk.red('problem occurred while connecting to youtrack', error));
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