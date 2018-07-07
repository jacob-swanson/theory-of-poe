import Constructable = jest.Constructable;

const registeredMods: ModMetadata[] = [];

export interface ModMetadata {
    pattern: string;
    constructor: Constructable;
}

export function mod(pattern: string) {
    return (constructor: Constructable) => {
        registeredMods.push({
            pattern,
            constructor
        });
    };
}

export class ModParser {
    public parse(modText: string) {
        for (const registeredMod of registeredMods) {
            const regex = this.patternToRegex(registeredMod.pattern);
            const result = regex.exec(modText);
            if (!result) {
                continue;
            }
            const args = [result[1]];
            const clazz = registeredMod.constructor;
            return new clazz(...args);
        }
        throw new Error(`Mod ${modText} not recognised`);
    }

    protected patternToRegex(pattern: string): RegExp {
        return new RegExp(pattern.replace("#", "([-\\+]?\\d+(,\\d+)*(\\.\\d+(e\\d+)?)?)"));
    }
}