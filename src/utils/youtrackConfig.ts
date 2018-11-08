import {YoutrackLoginOptions, YoutrackTokenOptions} from "youtrack-rest-client/dist/options/youtrack_options";
import {Credentials, CredentialStore} from "./credentialStore";
import {configStore} from "./configStore";
import {Youtrack} from "youtrack-rest-client";
import {YoutrackClient} from "youtrack-rest-client/dist/youtrack";
import {TimeTrackingConfig} from "../types/timeTrackingConfig";

export type YoutrackBaseConfigType = YoutrackLoginOptions | YoutrackTokenOptions | null;

export class YoutrackConfig {

    private config: YoutrackBaseConfigType = null;
    private timeTrackingConfig: TimeTrackingConfig | null = null;

    public get(): Promise<YoutrackBaseConfigType> {
        if (this.config) {
            return Promise.resolve(this.config);
        }

        return CredentialStore.get().then((credentials: Credentials | null) => {
            if (credentials) {
                if (configStore.get('authentication_type') === 'token') {
                    this.config = {
                        baseUrl: configStore.get('base_url'),
                        token: credentials.password
                    };
                    return this.config;
                }
                this.config = {
                    baseUrl: configStore.get('base_url'),
                    login: credentials.account,
                    password: credentials.password,
                };
                return this.config;
            }
            return null;
        })
    }

    public getYoutrackInstance(): Promise<YoutrackClient> {
        return this.get().then((config) => {
            if (config) {
                return new Youtrack(config).login();
            }
            return Promise.reject();
        });
    }

    public getTimeTrackingConfig(): TimeTrackingConfig {
        if (this.timeTrackingConfig) {
            return this.timeTrackingConfig;
        }
        let timetrackingConfig: any = configStore.get('timetracking');
        if (timetrackingConfig) {
            this.timeTrackingConfig = timetrackingConfig;
            return timetrackingConfig;
        } else {
            timetrackingConfig = {hoursADay: 8, daysAWeek: 5};
            configStore.set('timetracking', timetrackingConfig);
        }
        return timetrackingConfig;
    }

    public setTimeTrackingConfig(timeTrackingConfig: TimeTrackingConfig): void {
        if (timeTrackingConfig.hoursADay > 24) {
            timeTrackingConfig.hoursADay = timeTrackingConfig.hoursADay / 60;
        }
        this.timeTrackingConfig = timeTrackingConfig;
        configStore.set('timetracking', timeTrackingConfig);
    }

}

export const youtrackConfig = new YoutrackConfig();