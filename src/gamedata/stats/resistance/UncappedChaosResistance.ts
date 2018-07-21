import {BaseChaosResistance} from "./BaseChaosResistance";
import {ComputedStat} from "../ComputedStat";

export class UncappedChaosResistance extends ComputedStat {
    get value(): number {
        return this.character.sumStatByType(BaseChaosResistance);
    }
}