import {YoutrackCliCommand} from "../command";
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
import {YoutrackClient} from "youtrack-rest-client";

const moment = require('moment');

export class CreateWorkItemCommand extends BaseWorkItemCommand implements YoutrackCliCommand {
    private workItemParameters: any;
    private raw: boolean = false;

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
                    if (parseDateWithLocale(date, this.locale).isValid()) {
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

    private areAllParametersGiven() {
        return this.workItemParameters.issueId
            && this.workItemParameters.date
            && this.workItemParameters.duration
            && this.workItemParameters.description
            && this.workItemParameters.worktype;
    }

    public execute(raw: boolean, workItemParameters: any): Promise<any> {
        this.workItemParameters = workItemParameters;
        this.raw = raw;

        return this.detectLocale().then(() => actionWrapper((client) => {
            this.youtrackClient = client;

            if (this.areAllParametersGiven()) {
                return this.createWorkItem(client, this.workItemParameters);
            }

            return inquirer.prompt(this.getQueryPrompt()).then((answers: any) => {
                return this.createWorkItem(client, answers);
            });
        }));
    }

    private createWorkItem(client: YoutrackClient, workItemParams: any) {
        const workItem: WorkItem = {
            duration: new DurationParser(youtrackConfig.getTimeTrackingConfig()).parseDuration(workItemParams.duration),
            description: workItemParams.description,
            date: parseDateWithLocale(workItemParams.date, this.locale).toDate().getTime(),
            worktype: {
                name: workItemParams.worktype
            }
        };

        return client.workItems.create(workItemParams.issueId, workItem).then(workItemId => {
            if (this.raw) {
                return RawPrinter.print(workItemId);
            }
            TablePrinter.print([{workItemId}], ['workItemId']);
        }).catch(handleError);
    }
}