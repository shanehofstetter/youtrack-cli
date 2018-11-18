import {Field} from "youtrack-rest-client/dist/entities/issue";
import {toDateString} from "../printer";
import chalk from "chalk";

chalk.level = 1;

export function formatIssueFields(fields: Field[]) {
    return fields.map(f => {
        const {...field}: any = f;

        if (['created', 'updated', 'resolved'].indexOf(field.name) >= 0 && typeof field.value === 'string') {
            field.value = toDateString(field.value);
        }
        if (Array.isArray(field.value) && field.value.length > 0 && typeof field.value[0] === 'object') {
            formatArrayOfObjects(field);
        }
        if ('valueId' in field) {
            field.value = field.valueId;
        }
        if (typeof field.value === 'string' && ['true', 'false'].indexOf(field.value) >= 0) {
            field.value = field.value === 'true' ? 'Yes' : 'No';
        }

        if ("color" in field && !!field.color) {
            if (field.color.bg) {
                field.value = chalk.bgHex(field.color.bg)(field.value);
            }
            if (field.color.fg) {
                field.value = chalk.hex(field.color.fg)(field.value);
            }
        }

        field.name = chalk.bold(f.name);

        return field;
    });
}

function formatArrayOfObjects(field: Field): Field {
    if (!Array.isArray(field.value)) {
        return field;
    }
    if ('role' in field.value[0] && typeof field.value[0].role === 'string') {
        field.value = formatRoles(field.value);
    } else {
        field.value = field.value.map((v: any) => v.value).join(', ');
    }
    return field;
}

function formatRoles(roleFields: Field[]): string {
    let value: string = '';
    // first get a set of all roles
    const roles: string[] = Array.from(new Set(roleFields.map((v: any) => v.role).filter((v: any) => !!v)));

    for (let index = 0; index < roles.length; index++) {
        // get the issues/values by role and join them
        const role: string = roles[index];
        value += role + ": " + roleFields.filter((v: any) => v.role === role).map((v: any) => v.value).join(', ');
        // -> example: "parent for: T1-2, T1-3"
        if (index > 0) {
            value += ", ";
        }
        // -> example: "parent for: T1-2, T1-3, subtask of: T1-5"
    }

    return value;
}