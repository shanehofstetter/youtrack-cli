import chalk from "chalk";
import * as keytar from 'keytar';

export interface Credentials {
    account: string;
    password: string;
}

const SERVICE_NAME = 'youtrack-cli';

export class CredentialStore {

    public static get(): Promise<Credentials | null> {
        return keytar.findCredentials(SERVICE_NAME).then((credentials) => {
            if (credentials.length > 0) {
                return credentials[0];
            }
            return null;
        });
    }

    public static set(username: string, password: string): Promise<void> {
        return keytar.findCredentials(SERVICE_NAME).then((credentials) => {
            return Promise.all(credentials.map((credential) => {
                keytar.deletePassword(SERVICE_NAME, credential.account);
            })).then(() => {
                return keytar.setPassword(SERVICE_NAME, username, password);
            });
        }).catch(() => {
            return keytar.setPassword(SERVICE_NAME, username, password);
        });
    }

    public static async ensureCredentialsPresent() {
        const credentials = await CredentialStore.get();
        if (!credentials) {
            console.error('please setup youtrack-cli first, run: ' + chalk.yellow('$ youtrack setup'));
            process.exit(1);
        }
    }
}
