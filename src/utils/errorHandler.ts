import chalk from "chalk";

export function handleError(error: any) {
    if ("error" in error) {
        if (typeof error.error === 'string') {
            if (error.error.indexOf('{') === 0) {
                error.error = JSON.parse(error.error);
            } else {
                return console.error(chalk.red(error.error));
            }
        }
        if (typeof error.error === 'object' && "value" in error.error) {
            return console.error(chalk.red(error.error.value));
        }
    } else if ("message" in error) {
        return console.error(chalk.red(error.message));
    }
    console.error(chalk.red(error));
}
