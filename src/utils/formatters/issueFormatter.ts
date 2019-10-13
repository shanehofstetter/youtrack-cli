import { toDateString } from "../printer";
import chalk from "chalk";
import { IssueCustomField } from "youtrack-rest-client/dist/entities/issueCustomField";

chalk.level = 1;

export function formatIssueFields(fields: IssueCustomField[], filterFields: string[] = []) {
    return fields
        .filter(f => filterFields.indexOf(f.name) === -1)
        .map(f => {
            const { ...field }: any = f;

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

            if (field.value && typeof field.value.color === 'object') {
                let value = field.value.name;
                if (field.value.color.background) {
                    value = chalk.bgHex(field.value.color.background)(value);
                }
                if (field.value.color.foreground) {
                    value = chalk.hex(field.value.color.foreground)(value);
                }
                field.value = value;
            }

            if (field.value && typeof field.value === 'object' && field.value.name) {
                // console.log(field);
                field.value = field.value.name;
            }

            field.name = chalk.bold(f.name);

            return field;
        });
}

function formatArrayOfObjects(field: IssueCustomField): IssueCustomField {
    if (!Array.isArray(field.value)) {
        return field;
    }
    if ('role' in field.value[0] && typeof field.value[0].role === 'string') {
        field.value.name = formatRoles(field.value);
    } else {
        field.value.name = field.value.map((v: any) => v.value).join(', ');
    }
    return field;
}

function formatRoles(roleFields: IssueCustomField[]): string {
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
