import {YoutrackCliCommand} from "../command";
import chalk from "chalk";
import {actionWrapper} from "../../utils/commander";
import * as inquirer from "inquirer";
import {DurationParser} from "../../utils/parsers/duration";
import {youtrackConfig} from "../../utils/youtrackConfig";
import {WorkItem} from "youtrack-rest-client";
import {formatDuration} from "../../utils/formatters/durationFormatter";
import {timestampToDate} from "../../utils/printer";
import {parseDateWithLocale, toLocalizedDateString} from "../../utils/locale";
import {BaseWorkItemCommand} from "./baseWorkItemCommand";
import {printError} from "../../utils/errorHandler";

export class EditWorkItemCommand extends BaseWorkItemCommand implements YoutrackCliCommand {
    private issueId: string = '';
    private workItemId: string = '';

    private getIdentificationQuestions(): any[] {
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
                name: 'workItemId',
                message: 'Work-Item ID:',
                validate: (workItemId: any) => {
                    if (workItemId.length >= 1) {
                        return true;
                    }
                    return chalk.red('please provide a valid Work-Item ID');
                }
            }
        ];
    }

    private getWorkItemQuestions(workItem: WorkItem): any[] {
        return [
            {
                type: 'input',
                name: 'duration',
                message: 'Duration:',
                default: formatDuration(workItem.duration),
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
                default: toLocalizedDateString(timestampToDate(workItem.date), this.locale),
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
                message: 'Description:',
                default: workItem.description
            }
        ]
    }

    public execute(): Promise<any> {
        return this.detectLocale().then(() => {
            return actionWrapper((client) => {
                this.youtrackClient = client;
                return inquirer.prompt(this.getIdentificationQuestions()).then((answers: any) => {
                    this.issueId = answers.issueId;
                    this.workItemId = answers.workItemId;

                    return client.workItems.all(this.issueId).then((workItems: WorkItem[]) => {
                        const workItem = workItems.find(w => w.id === this.workItemId);
                        if (!workItem) {
                            return console.log(chalk.red(`Work Item ${answers.workItemId} not found.`))
                        }

                        return inquirer.prompt(this.getWorkItemQuestions(workItem)).then((answers: any) => {
                            const workItem: WorkItem = {
                                id: this.workItemId,
                                duration: new DurationParser(youtrackConfig.getTimeTrackingConfig()).parseDuration(answers.duration),
                                description: answers.description,
                                date: parseDateWithLocale(answers.date, this.locale).toDate().getTime()
                            };
                            return client.workItems.edit(this.issueId, workItem).then(() => {
                                console.log(chalk.green(`Work Item ${this.workItemId} updated.`))
                            }).catch(printError);
                        });
                    }).catch(printError);
                });
            })
        });
    }
}