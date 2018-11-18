import {Issue, YoutrackClient} from "youtrack-rest-client";
import chalk from "chalk";
import {getFormattedErrorMessage} from "../../utils/errorHandler";

const osLocale = require('os-locale');

export abstract class BaseWorkItemCommand {

    protected workTypeNames: string[] = [];
    protected locale: string = "en-US";
    protected youtrackClient: YoutrackClient | null = null;
    protected issue: Issue | null = null;

    protected fetchWorkTypes(issueId: string): Promise<any> {
        // TODO: implement endpoints and/or methods in youtrack-rest-client

        if (this.youtrackClient !== null) {
            return this.youtrackClient.issues.byId(issueId).then(issue => {
                this.issue = issue;

                if (this.youtrackClient) {
                    let projectShortName: any = issue.field.find(f => f.name === 'projectShortName');
                    if (projectShortName && typeof projectShortName.value === 'string') {
                        projectShortName = projectShortName.value;

                        const workTypesUrl: string = '/admin/project/' + projectShortName + '/timetracking/worktype';
                        return this.youtrackClient.get(workTypesUrl).then((response) => {
                            if (response.length > 0) {
                                this.workTypeNames = response.map((wt: any) => wt.name);
                            }
                        }).catch(error => {
                            this.issue = null;
                            return Promise.reject(getFormattedErrorMessage(error));
                        });
                    }
                }
            }).catch(error => {
                return Promise.reject(getFormattedErrorMessage(error));
            });
        }
        // this code should never be reached, the if-clause is required for type-safety reasons.
        return Promise.reject('unknown error.');
    }

    protected detectLocale(): Promise<any> {
        return osLocale().then((locale: string) => {
            if (locale) {
                this.locale = locale;
            }
        }).catch(() => {
            return Promise.resolve();
        });
    }

    protected validateIssueIdAndFetchWorkTypes(issueId: string): Promise<boolean | string> {
        if (issueId.length > 1) {
            return this.fetchWorkTypes(issueId).then(() => {
                return Promise.resolve(true);
            }).catch((error: string) => {
                return Promise.resolve(error);
            });
        }
        return Promise.resolve(chalk.red('please provide a valid Issue ID'));
    }
}