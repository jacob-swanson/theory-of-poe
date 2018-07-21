import {ValueStat} from "../stats/ValueStat";

export class Mod {
    protected constructor(public readonly stats: Array<ValueStat<any>>) {
    }
}