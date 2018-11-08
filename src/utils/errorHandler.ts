import chalk from "chalk";

export function handleError(error: any) {
    if ("error" in error && "value" in error.error) {
        return console.error(chalk.red(error.error.value));
    } else if ("message" in error) {
        return console.error(chalk.red(error.message));
    }
    console.error(chalk.red(error));
}
