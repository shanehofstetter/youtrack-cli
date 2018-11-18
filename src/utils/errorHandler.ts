import chalk from "chalk";

export function printError(error: any) {
    console.error(getFormattedErrorMessage(error));
}

export function getFormattedErrorMessage(error: any): string {
    if (typeof error === "string") {
        return chalk.red(error);
    }
    if ("error" in error) {
        if (typeof error.error === 'string') {
            if (error.error.indexOf('{') === 0) {
                error.error = JSON.parse(error.error);
            } else {
                return chalk.red(error.error);
            }
        }
        if (typeof error.error === 'object' && "value" in error.error) {
            return chalk.red(error.error.value);
        }
    } else if ("message" in error) {
        return chalk.red(error.message);
    }
    return chalk.red(error);
}
