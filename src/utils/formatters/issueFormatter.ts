import {Field} from "youtrack-rest-client/dist/entities/issue";
import {toDateString} from "../printer";
import chalk from "chalk";

export function formatIssueFields(fields: Field[]) {
    return fields.map(f => {
        const {...field}: any = f;

        if (['created', 'updated'].indexOf(field.name) >= 0 && typeof field.value === 'string') {
            field.value = toDateString(field.value);
        }
        if (Array.isArray(field.value) && field.value.length == 1 && typeof field.value[0] === 'object') {
            field.value = field.value[0].value;
        }

        if ("color" in field && !!field.color) {
            const prevLevel = chalk.level;
            chalk.level = 1;

            if (field.color.bg) {
                field.value = chalk.hex(field.color.bg)(field.value);
            }
            if (field.color.fg) {
                field.value = chalk.hex(field.color.fg)(field.value);
            }

            chalk.level = prevLevel;
        }

        field.name = chalk.bold(f.name);

        return field;
    });
}