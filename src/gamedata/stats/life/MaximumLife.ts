import {BaseMaximumLife} from "./BaseMaximumLife";
import {MaximumLifePercent} from "./MaximumLifePercent";
import {ChaosInoculation} from "../keystones/ChaosInoculation";
import {ComputedStat} from "../ComputedStat";

export class MaximumLife extends ComputedStat {
    get value(): number {
        const hasChaosInoculation = this.character.hasStat(ChaosInoculation);
        if (hasChaosInoculation) {
            return 1;
        }

        const baseValue = this.character.sumStatByType(BaseMaximumLife);
        const increasePercent = this.character.sumStatByType(MaximumLifePercent);

        return baseValue * (1 + increasePercent / 100);
    }
}