import {ComputedStat} from "../ComputedStat";
import {StatConstructor} from "../Stat";
import {BaseIntelligence} from "./BaseIntelligence";
import {IntelligencePercent} from "./IntelligencePercent";

export class Intelligence extends ComputedStat {
    protected readonly baseType: StatConstructor<number> = BaseIntelligence;
    protected readonly increasedType: StatConstructor<number> = IntelligencePercent;
}