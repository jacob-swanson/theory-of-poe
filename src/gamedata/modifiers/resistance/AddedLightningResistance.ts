import {Mod} from "../Mod";
import {mod} from "../ModParser";
import {BaseLightningResistance} from "../../stats/resistance/BaseLightningResistance";

@mod("#% to Lightning Resistance")
export class AddedLightningResistance extends Mod {
    constructor(value: number) {
        super([
            new BaseLightningResistance(value)
        ]);
    }
}