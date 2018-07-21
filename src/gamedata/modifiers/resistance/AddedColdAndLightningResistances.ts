import {Mod} from "../Mod";
import {mod} from "../ModParser";
import {BaseColdResistance} from "../../stats/resistance/BaseColdResistance";
import {BaseLightningResistance} from "../../stats/resistance/BaseLightningResistance";

@mod("#% to Cold and Lightning Resistances")
export class AddedColdAndLightningResistances extends Mod {
    constructor(value: number) {
        super([
            new BaseColdResistance(value),
            new BaseLightningResistance(value)
        ]);
    }
}