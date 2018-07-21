import {ConsoleLogger} from "./ConsoleLogger";
import {Logger} from "./Logger";

export class LoggerFactory {
    private constructor() {
    }

    public static getLogger(object: object | string): Logger {
        if (typeof object === "string") {
            return new ConsoleLogger(object);
        }
        return new ConsoleLogger(object.constructor.name);
    }
}