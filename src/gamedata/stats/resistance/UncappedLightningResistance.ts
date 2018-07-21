import {BaseLightningResistance} from "./BaseLightningResistance";
import {ComputedStat} from "../ComputedStat";

export class UncappedLightningResistance extends ComputedStat {
    get value(): number {
        return this.character.sumStatByType(BaseLightningResistance);
    }
}