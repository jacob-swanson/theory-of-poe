import {Logger} from "./Logger";
import {Json} from "../Json";
import {LogLevel} from "./LogLevel";

/**
 * Outputs log messages using console.log.
 */
export class ConsoleLogger extends Logger {
    protected readonly tag: string;

    constructor(tag: string) {
        super();
        this.tag = tag;
    }

    public log(level: LogLevel, message: string, ...context: Json[]): void {
        /* tslint:disable:no-console */
        const datetime = new Date().toISOString();
        const output = `[${datetime}] [${this.tag}] [${level}] ${message}`;
        if (Array.isArray(context) && context.length > 0) {
            if (context.length === 1) {
                console.log(output, context[0]);
            } else {
                console.log(output, context);
            }
        } else {
            console.log(output);
        }
        /* tslint:enable:no-console */
    }
}
