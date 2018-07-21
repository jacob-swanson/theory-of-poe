export class StringUtils {
    private constructor() {
    }

    public static indent(value: string, indent: string = "    "): string {
        return value.replace(/^(?=.)/gm, indent);
    }

    public static padStart(value: string, targetLength: number, padString: string = " "): string {
        if (value.length > targetLength) {
            return value;
        } else {
            targetLength = targetLength - value.length;
            if (targetLength > padString.length) {
                padString += padString.repeat(targetLength / padString.length);
            }
            return padString.slice(0, targetLength) + value;
        }
    }

    public static padEnd(value: string, targetLength: number, padString: string = " "): string {
        if (value.length > targetLength) {
            return value;
        } else {
            targetLength = targetLength - value.length;
            if (targetLength > padString.length) {
                padString += padString.repeat(targetLength / padString.length);
            }
            return value + padString.slice(0, targetLength);
        }
    }
}