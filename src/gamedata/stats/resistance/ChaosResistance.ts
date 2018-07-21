import {ChaosInoculation} from "../keystones/ChaosInoculation";
import {BaseChaosResistance} from "./BaseChaosResistance";
import {BaseMaxChaosResistance} from "./BaseMaxChaosResistance";
import {MathUtils} from "../../../utils/MathUtils";
import {ComputedStat} from "../ComputedStat";

export class ChaosResistance extends ComputedStat {
    get value(): number {
        if (this.character.hasStat(ChaosInoculation)) {
            return 100;
        }

        const baseValue = this.character.sumStatByType(BaseChaosResistance);
        const maxResist = this.character.sumStatByType(BaseMaxChaosResistance);

        return MathUtils.clamp(baseValue, maxResist, 100);
    }
}