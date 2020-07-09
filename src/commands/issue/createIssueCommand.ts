import { YoutrackCliCommand } from "../command";
import chalk from "chalk";
import { actionWrapper } from "../../utils/commander";
import { printError } from "../../utils/errorHandler";
import { ReducedProject, YoutrackClient } from "youtrack-rest-client";
import * as inquirer from "inquirer";

export class CreateIssueCommand implements YoutrackCliCommand {

    projects: ReducedProject[] = [];

    private getIssuePrompt(client: YoutrackClient) {
        return [
            {
                type: 'list',
                name: 'project',
                message: 'Project:',
                choices: () => {
                    return client.projects.all().then((projects) => {
                        this.projects = projects;
                        return projects.map((proj) => proj.shortName) as string[];
                    });
                },
            },
            {
                type: 'input',
                name: 'summary',
                message: 'Summary (Title):',
                validate: (summary: any) => {
                    if (summary.length >= 1) {
                        return true;
                    }
                    return chalk.red('please provide a valid summary');
                },
            },
            {
                type: 'input',
                name: 'description',
                message: 'Description:',
            },
            {
                type: 'input',
                name: 'assignee',
                message: 'Assignee:',
                validate: (assignee: string) => {
                    if (assignee.length === 0) {
                        return true;
                    }
                    return client.users.byId(assignee).then(() => {
                        return true;
                    }).catch(() => {
                        return chalk.red('please provide a valid assignee or leave blank for unassigned');
                    });
                },
            },
        ];
    }

    execute() {
        return actionWrapper((client: YoutrackClient) => {
            return inquirer.prompt(this.getIssuePrompt(client)).then((answers: any) => {
                const project = this.projects.find(p => p.shortName === answers.project);
                if (!project) return console.error('project not found');

                const issueObj = {
                    summary: answers.summary,
                    description: answers.description,
                    project: {
                        id: <string>project.id,
                    },
                    type: answers.type,
                    assignee: undefined,
                };
                if (answers.assignee !== '') {
                    issueObj.assignee = answers.assignee;
                }
                client.issues.create(issueObj).then(({ numberInProject, project }) => {
                    console.log(chalk.green(`new issue with id ${project && project.shortName}-${numberInProject} created.`));
                }).catch(printError);
            });
        });
    }
}