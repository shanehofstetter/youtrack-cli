import {table} from "table";
import chalk from "chalk";

export class RawPrinter {
    public static print(object: any) {
        console.log(chalk.green(JSON.stringify(object, null, '  ')));
    }
}

export class TablePrinter {
    public static print(objects: any[], attributes: string[], columnConfig: {} = {}) {
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
            border: {
                topBody: `─`,
                topJoin: `┬`,
                topLeft: `┌`,
                topRight: `┐`,

                bottomBody: `─`,
                bottomJoin: `┴`,
                bottomLeft: `└`,
                bottomRight: `┘`,

                bodyLeft: `│`,
                bodyRight: `│`,
                bodyJoin: `│`,

                joinBody: `─`,
                joinLeft: `├`,
                joinRight: `┤`,
                joinJoin: `┼`
            },
            columns: {
                ...columnConfig
            }
        };
        console.log(table(rows, config));
    }
}