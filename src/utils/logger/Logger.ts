import {Json} from "../Json";
import {LogLevel} from "./LogLevel";

const logLevels: LogLevel[] = ["trace", "debug", "info", "warn", "error"];

export abstract class Logger {
    protected logLevel: number = 1;

    constructor(logLevel: LogLevel = "debug") {
        this.logLevel = logLevels.indexOf(logLevel);
    }

    public isDebugEnabled() {
        return this.isLevelEnabled("debug");
    }

    public isInfoEnabled() {
        return this.isLevelEnabled("info");
    }

    public isWarnEnabled() {
        return this.isLevelEnabled("warn");
    }

    public isErrorEnabled() {
        return this.isLevelEnabled("error");
    }

    public isTraceEnabled() {
        return this.isLevelEnabled("trace");
    }

    public debug(message: string, ...context: any[]): void {
        this.log("debug", message, ...context);
    }

    public info(message: string, ...context: any[]): void {
        this.log("info", message, ...context);
    }

    public warn(message: string, ...context: any[]): void {
        this.log("warn", message, ...context);
    }

    public error(message: string, ...context: any[]): void {
        this.log("error", message, ...context);
    }

    public trace(message: string, ...context: any[]): void {
        this.log("trace", message, ...context);
    }

    public log(level: LogLevel, message: string, ...context: Json[]): void {
        if (this.isLevelEnabled(level)) {
            this.writeLine(level, message, ...context);
        }
    }

    public isLevelEnabled(level: LogLevel) {
        return logLevels.indexOf(level) >= this.logLevel;
    }

    protected abstract writeLine(level: LogLevel, message: string, ...context: Json[]): void;
}
