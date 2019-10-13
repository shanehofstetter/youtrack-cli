const packageJson = require('../../package.json');

export class PackageInformation {
    public static get(): { [key: string]: any } {
        return packageJson;
    }
}
