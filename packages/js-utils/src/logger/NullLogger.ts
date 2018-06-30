import {Logger} from "./Logger";
import {Json} from "../Json";
import {LogLevel} from "./LogLevel";

/**
 * Drop in replacement for {@link ConsoleLogger} that ignores everything.
 */
export class NullLogger extends Logger {
    constructor(tag?: string) {
        super();
    }

    public log(level: LogLevel, message: string, ...context: Json[]): void {
    }
}
