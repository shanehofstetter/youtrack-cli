import { Issue, WorkItemType, YoutrackClient } from "youtrack-rest-client";
import chalk from "chalk";
import { getFormattedErrorMessage } from "../../utils/errorHandler";

const osLocale = require('os-locale');

export abstract class BaseWorkItemCommand {

    protected workItemTypes: WorkItemType[] = [];
    protected locale: string = "en-US";
    protected youtrackClient: YoutrackClient | null = null;
    protected issue: Issue | null = null;

    protected fetchWorkTypes(issueId: string): Promise<any> {
        // TODO: implement endpoints and/or methods in youtrack-rest-client

        if (this.youtrackClient !== null) {
            return this.youtrackClient.issues.byId(issueId).then(issue => {
                this.issue = issue;

                if (this.youtrackClient) {
                    let projectShortName = issue.project && issue.project.id;
                    if (projectShortName) {
                        const workTypesUrl: string = '/admin/projects/' + projectShortName + '/timeTrackingSettings/workItemTypes?fields=id,name';
                        return this.youtrackClient.get(workTypesUrl).then((response) => {
                            if (response.length > 0) this.workItemTypes = response;
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