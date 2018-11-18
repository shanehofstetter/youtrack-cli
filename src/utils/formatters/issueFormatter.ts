import {Field} from "youtrack-rest-client/dist/entities/issue";
import {toDateString} from "../printer";
import chalk from "chalk";

const htmlToText = require('html-to-text');

chalk.level = 1;

export function formatIssueFields(fields: Field[], filterFields: string[] = []) {
    return fields
        .filter(f => filterFields.indexOf(f.name) === -1)
        .map(f => {
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
            if (field.name === 'description') {
                field.value = formatTextContent(field.value);
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

export function formatTextContent(description: string): string {
    // html content is wrapped inside special tags
    // example: {html class=lorem}<html>ipsum</html>{html}
    const htmlRegex = /{html[a-zA-Z=\s]*}([\s\S]*?){html[a-zA-Z=\s]*}/mi;

    const htmlContentMatch = description.match(htmlRegex);
    if (htmlContentMatch && htmlContentMatch.length > 0) {
        description = description.replace(new RegExp(htmlRegex, 'gmi'), htmlToText.fromString(htmlContentMatch[1], {
            ignoreImage: true,
            ignoreHref: true,
            tables: true,
            wordwrap: 120
        }));
    }

    // remove {cut} tags (unsure what the semantic is there)
    description = description.replace(/{cut[\s>]*}/gmi, '');

    // remove large chunks of whitespace
    while (description.match(/\n\n\n/gm)) {
        description = description.replace(/\n\n\n/gm, '\n\n');
    }

    return description;
}