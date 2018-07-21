import {BaseFireResistance} from "./BaseFireResistance";
import {ComputedStat} from "../ComputedStat";

export class UncappedFireResistance extends ComputedStat {
    get value(): number {
        return this.character.sumStatByType(BaseFireResistance);
    }
}