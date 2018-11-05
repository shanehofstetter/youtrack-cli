import chalk from "chalk";

export function handleError(error: any) {
    if ("message" in error) {
        return console.error(chalk.red(error.message));
    }
    console.error(error);
}