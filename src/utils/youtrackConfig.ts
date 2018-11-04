import {YoutrackLoginOptions, YoutrackTokenOptions} from "youtrack-rest-client/dist/options/youtrack_options";
import {Credentials, CredentialStore} from "./credentialStore";
import {configStore} from "./configStore";
import {Youtrack} from "youtrack-rest-client";
import {YoutrackClient} from "youtrack-rest-client/dist/youtrack";

export type YoutrackConfigType = YoutrackLoginOptions | YoutrackTokenOptions | null;

export class YoutrackConfig {

    private config: YoutrackConfigType = null;

    public get(): Promise<YoutrackConfigType> {
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
}
