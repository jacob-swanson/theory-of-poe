import {ValueStat} from "../stats/ValueStat";

export abstract class Mod {
    protected constructor(public readonly stats: Array<ValueStat<any>>) {
    }

    public getDescription(): string[] {
        return ["Unsupported"];
    }
}