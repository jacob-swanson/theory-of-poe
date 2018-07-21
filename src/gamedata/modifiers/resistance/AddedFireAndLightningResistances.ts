import {Mod} from "../Mod";
import {mod} from "../ModParser";
import {BaseFireResistance} from "../../stats/resistance/BaseFireResistance";
import {BaseLightningResistance} from "../../stats/resistance/BaseLightningResistance";

@mod("#% to Fire and Lightning Resistances")
export class AddedFireAndLightningResistances extends Mod {
    constructor(value: number) {
        super([
            new BaseFireResistance(value),
            new BaseLightningResistance(value)
        ]);
    }
}