import {YoutrackClient} from "youtrack-rest-client";
import chalk from "chalk";

const osLocale = require('os-locale');

export abstract class BaseWorkItemCommand {

    protected workTypeNames: string[] = [];
    protected locale: string = "en-US";
    protected youtrackClient: YoutrackClient | null = null;

    protected fetchWorkTypes(issueId: string): Promise<any> {
        // TODO: implement endpoints and/or methods in youtrack-rest-client

        if (this.youtrackClient !== null) {
            return this.youtrackClient.issues.byId(issueId).then(issue => {
                if (this.youtrackClient) {
                    let projectShortName: any = issue.field.find(f => f.name === 'projectShortName');
                    if (projectShortName && typeof projectShortName.value === 'string') {
                        projectShortName = projectShortName.value;

                        const workTypesUrl: string = '/admin/project/' + projectShortName + '/timetracking/worktype';
                        this.youtrackClient.get(workTypesUrl).then((response) => {
                            if (response.length > 0) {
                                this.workTypeNames = response.map((wt: any) => wt.name);
                            }
                        });
                    }
                }
            });
        }
        return Promise.reject();
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
            }).catch(() => {
                const errorMessage: string = chalk.red("issue '")
                    + chalk.yellow(issueId)
                    + chalk.red("' does not seem to exist");
                return Promise.resolve(errorMessage);
            });
        }
        return Promise.resolve(chalk.red('please provide a valid Issue ID'));
    }
}