import {table, getBorderCharacters} from "table";
import chalk from "chalk";

export class RawPrinter {
    public static print(object: any) {
        console.log(chalk.green(JSON.stringify(object, null, '  ')));
    }
}

export class TablePrinter {
    public static print(objects: any[], attributes: string[], columnConfig: {} = {}, columnDefault: {} = {}) {
        const rows = objects.map(obj => {
            return attributes.map(attr => {
                const value = obj[attr];
                if (!value) {
                    return '';
                }
                return String(value).replace(/[\n\t\r]/g, ' ');
            });
        });

        rows.unshift(attributes.map((a) => chalk.green(a)));


        const config = {
            border: getBorderCharacters(`norc`),
            columns: {
                ...columnConfig
            },
            columnDefault
        };
        console.log(table(rows, config));
    }
}

export function printObject(object: any, options: any) {
    if (options.raw) {
        RawPrinter.print(object);
    } else {
        const attributes = options.attributes;
        if (!Array.isArray(object)) {
            object = [object];
        }
        TablePrinter.print(object, attributes, options['columnConfig'] || {}, options['columnDefault'] || {});
    }
}

export function timestampToDate(timestamp: string | number): Date {
    if (typeof timestamp !== 'number') {
        timestamp = parseInt(timestamp);
    }
    return new Date(timestamp);
}

export function toDateString(timestamp: string | number, showTime: boolean = true): string {
    const date = timestampToDate(timestamp);
    if (showTime) {
        return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
    }
    return date.toLocaleDateString();
}