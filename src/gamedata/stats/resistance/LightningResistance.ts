import {MathUtils} from "../../../utils/MathUtils";
import {BaseLightningResistance} from "./BaseLightningResistance";
import {BaseMaxLightningResistance} from "./BaseMaxLightningResistance";
import {ComputedStat} from "../ComputedStat";

export class LightningResistance extends ComputedStat {
    get value(): number {
        const baseValue = this.character.sumStatByType(BaseLightningResistance);
        const maxResist = this.character.sumStatByType(BaseMaxLightningResistance);

        return MathUtils.clamp(baseValue, maxResist, 100);
    }
}