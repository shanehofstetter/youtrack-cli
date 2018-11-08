import {YoutrackCliCommand} from "../commands";
import {actionWrapper} from "../../utils/commander";
import chalk from "chalk";
import * as inquirer from "inquirer";
import {WorkItem} from "youtrack-rest-client/dist/entities/workItem";
import {RawPrinter, TablePrinter} from "../../utils/printer";
import {handleError} from "../../utils/errorHandler";
import {getLocaleDateFormat, parseDateWithLocale} from "../../utils/locale";
import {DurationParser} from "../../utils/parsers/duration";
import {youtrackConfig} from "../../utils/youtrackConfig";
import {BaseWorkItemCommand} from "./baseWorkItemCommand";

const moment = require('moment');

export class CreateWorkItemCommand extends BaseWorkItemCommand implements YoutrackCliCommand {

    private getQueryPrompt() {
        return [
            {
                type: 'input',
                name: 'issueId',
                message: 'Issue ID:',
                validate: (issueId: any) => {
                    return this.validateIssueIdAndFetchWorkTypes(issueId);
                }
            },
            {
                type: 'input',
                name: 'duration',
                message: 'Duration:',
                default: '1h',
                validate: (duration: string) => {
                    if (new DurationParser(youtrackConfig.getTimeTrackingConfig()).parseDuration(duration) > 0) {
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
        return this.detectLocale().then(() => actionWrapper((client) => {
            this.youtrackClient = client;
            return inquirer.prompt(this.getQueryPrompt()).then((answers: any) => {
                const workItem: WorkItem = {
                    duration: new DurationParser(youtrackConfig.getTimeTrackingConfig()).parseDuration(answers.duration),
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