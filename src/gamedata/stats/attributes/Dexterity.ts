import {ComputedStat} from "../ComputedStat";
import {StatConstructor} from "../Stat";
import {BaseDexterity} from "./BaseDexterity";
import {DexterityPercent} from "./DexterityPercent";

export class Dexterity extends ComputedStat {
    protected readonly baseType: StatConstructor<number> = BaseDexterity;
    protected readonly increasedType: StatConstructor<number> = DexterityPercent;
}