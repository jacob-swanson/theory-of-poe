import {ComputedStat} from "../ComputedStat";
import {StatConstructor} from "../Stat";
import {BaseDexterity} from "./BaseDexterity";
import {DexterityPercent} from "./DexterityPercent";
import {BaseStrength} from "./BaseStrength";
import {StrengthPercent} from "./StrengthPercent";

export class Strength extends ComputedStat {
    protected readonly baseType: StatConstructor<number> = BaseStrength;
    protected readonly increasedType: StatConstructor<number> = StrengthPercent;
}