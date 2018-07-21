import {MathUtils} from "../../../utils/MathUtils";
import {BaseFireResistance} from "./BaseFireResistance";
import {BaseMaxFireResistance} from "./BaseMaxFireResistance";
import {ComputedStat} from "../ComputedStat";

export class FireResistance extends ComputedStat {
    get value(): number {
        const baseValue = this.character.sumStatByType(BaseFireResistance);
        const maxResist = this.character.sumStatByType(BaseMaxFireResistance);

        return MathUtils.clamp(baseValue, maxResist, 100);
    }
}