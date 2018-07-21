import {BaseColdResistance} from "./BaseColdResistance";
import {ComputedStat} from "../ComputedStat";

export class UncappedColdResistance extends ComputedStat {
    get value(): number {
        return this.character.sumStatByType(BaseColdResistance);
    }
}