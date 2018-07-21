import {Mod} from "../Mod";
import {mod} from "../ModParser";
import {BaseFireResistance} from "../../stats/resistance/BaseFireResistance";
import {BaseLightningResistance} from "../../stats/resistance/BaseLightningResistance";
import {BaseColdResistance} from "../../stats/resistance/BaseColdResistance";

@mod("#% to all Elemental Resistances")
export class AddedAllElementalResistances extends Mod {
    constructor(value: number) {
        super([
            new BaseFireResistance(value),
            new BaseColdResistance(value),
            new BaseLightningResistance(value)
        ]);
    }
}