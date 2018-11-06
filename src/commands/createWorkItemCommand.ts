import {YoutrackCliCommand} from "./commands";
import {actionWrapper} from "../utils/commander";
import chalk from "chalk";
import * as inquirer from "inquirer";
import {YoutrackClient} from "youtrack-rest-client/dist/youtrack";
import {WorkItem} from "youtrack-rest-client/dist/entities/workItem";
import {RawPrinter, TablePrinter} from "../utils/printer";
import {handleError} from "../utils/errorHandler";
import {getLocaleDateFormat, parseDateWithLocale} from "../utils/locale";
import {DurationParser} from "../utils/parsers/duration";
import {TimeTrackingConfig} from "../types/timeTrackingConfig";

const moment = require('moment');
const osLocale = require('os-locale');

export class CreateWorkItemCommand implements YoutrackCliCommand {

    private workTypeNames: string[] = [];
    private timeTrackingConfig: TimeTrackingConfig = {hoursADay: 8, daysAWeek: 5};
    private locale: string = "en-US";
    private youtrackClient: YoutrackClient | null = null;

    private fetchWorkItemNamesForIssue(issueId: string): Promise<any> {
        // TODO: implement endpoints and/or methods in youtrack-rest-client

        if (this.youtrackClient !== null) {
            return this.youtrackClient.issues.byId(issueId).then(issue => {
                let projectShortName: any = issue.field.find(f => f.name === 'projectShortName');
                if (projectShortName && typeof projectShortName.value === 'string') {
                    projectShortName = projectShortName.value;
                }
                if (this.youtrackClient) {
                    const workTypesUrl: string = '/admin/project/' + projectShortName + '/timetracking/worktype';
                    this.youtrackClient
                        .get(workTypesUrl).then((response) => {
                        if (response.length > 0) {
                            this.workTypeNames = response.map((wt: any) => wt.name);
                        }
                    });
                    this.youtrackClient
                        .get('/admin/timetracking').then((response) => {
                        this.timeTrackingConfig = response;
                    }).catch(error => {
                        // most probably permission error
                        // ... falling back to defaults
                    });
                }
            });
        }
        return Promise.reject();
    }

    private getQueryPrompt() {
        return [
            {
                type: 'input',
                name: 'issueId',
                message: 'Issue ID:',
                validate: (issueId: any) => {
                    if (issueId.length > 1) {
                        return this.fetchWorkItemNamesForIssue(issueId).then(() => {
                            return Promise.resolve(true);
                        }).catch(() => {
                            const errorMessage: string = chalk.red("issue '")
                                + chalk.yellow(issueId)
                                + chalk.red("' does not seem to exist");
                            return Promise.resolve(errorMessage);
                        });
                    }
                    return chalk.red('please provide a valid Issue ID');
                }
            },
            {
                type: 'input',
                name: 'duration',
                message: 'Duration:',
                default: '1h',
                validate: (duration: string) => {
                    if (new DurationParser(this.timeTrackingConfig).parseDuration(duration) > 0) {
                        return true;
                    }
                    return chalk.red('please provide a duration greater than 0 minutes');
                }
            },
            {
                type: 'input',
                name: 'date',
                message: 'Date:',
                default: moment().format(getLocaleDateFormat(this.locale)),
                validate: (date: string) => {
                    if (!isNaN(Date.parse(date))) {
                        return true;
                    }
                    return chalk.red('please provide a valid date');
                }
            },
            {
                type: 'input',
                name: 'description',
                message: 'Description:'
            },
            {
                type: 'list',
                name: 'worktype',
                message: 'Work-Type:',
                choices: () => {
                    return this.workTypeNames;
                },
                when: () => {
                    return this.workTypeNames.length > 0;
                }
            },
            {
                type: 'input',
                name: 'worktype',
                message: 'Work-Type:',
                when: () => {
                    return this.workTypeNames.length === 0;
                }
            }
        ]
    }

    public execute(raw: boolean): Promise<any> {
        return osLocale().then((locale: string) => {
            if (locale) {
                this.locale = locale;
            }
        }).then(() => actionWrapper((client) => {
            this.youtrackClient = client;
            return inquirer.prompt(this.getQueryPrompt()).then((answers: any) => {
                const workItem: WorkItem = {
                    duration: new DurationParser(this.timeTrackingConfig).parseDuration(answers.duration),
                    description: answers.description,
                    date: parseDateWithLocale(answers.date, this.locale).toDate().getTime(),
                    worktype: {
                        name: answers.worktype
                    }
                };

                return client.workItems.create(answers.issueId, workItem).then(workItemId => {
                    if (raw) {
                        return RawPrinter.print(workItemId);
                    }
                    TablePrinter.print([{workItemId}], ['workItemId']);
                }).catch(handleError);
            });
        }));
    }
}