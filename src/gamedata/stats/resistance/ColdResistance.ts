import {BaseMaxChaosResistance} from "./BaseMaxChaosResistance";
import {MathUtils} from "../../../utils/MathUtils";
import {BaseColdResistance} from "./BaseColdResistance";
import {ComputedStat} from "../ComputedStat";

export class ColdResistance extends ComputedStat {
    get value(): number {
        const baseValue = this.character.sumStatByType(BaseColdResistance);
        const maxResist = this.character.sumStatByType(BaseMaxChaosResistance);

        return MathUtils.clamp(baseValue, maxResist, 100);
    }
}