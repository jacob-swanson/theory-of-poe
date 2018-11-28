import {BaseMaximumLife} from "./BaseMaximumLife";
import {MaximumLifePercent} from "./MaximumLifePercent";
import {ChaosInoculation} from "../keystones/ChaosInoculation";
import {ComputedStat} from "../ComputedStat";
import {StatConstructor} from "../Stat";

export class MaximumLife extends ComputedStat {
    protected readonly baseType: StatConstructor<number> = BaseMaximumLife;
    protected readonly increasedType: StatConstructor<number> | undefined = MaximumLifePercent;


    protected computeValue(): number {
        const hasChaosInoculation = this.character.hasStat(ChaosInoculation);
        if (hasChaosInoculation) {
            return 1;
        }

        return super.computeValue();
    }
}