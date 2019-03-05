import {Mod} from "./Mod";

export class UnsupportedModifier extends Mod {
    constructor(public readonly description: string) {
        super([]);
    }

    public getDescription(): string[] {
        return [`(Unsupported) ${this.description}`];
    }
}