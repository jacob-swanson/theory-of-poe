import * as fs from "fs";
import * as path from "path";
import {ConsoleLogger} from "./logger/ConsoleLogger";

const log = new ConsoleLogger("FilesystemUtils");

export class FilesystemUtils {
    private constructor() {
    }

    public static mkdir(path: string): void {
        if (!fs.existsSync(path)) {
            fs.mkdirSync(path);
        }
    }

    public static mkdirs(directoryPath: string): void {
        const directories = [];
        let tmpPath = directoryPath;
        while (!fs.existsSync(tmpPath)) {
            directories.push(tmpPath);
            tmpPath = path.join(tmpPath, "..");
        }

        directories
            .reverse()
            .forEach(dir => fs.mkdirSync(dir));
    }
}