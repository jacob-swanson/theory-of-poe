import {Mod} from "../Mod";
import {mod} from "../ModParser";
import {BaseColdResistance} from "../../stats/resistance/BaseColdResistance";
import {BaseFireResistance} from "../../stats/resistance/BaseFireResistance";

@mod("#% to Fire and Cold Resistances")
export class AddedFireAndColdResistances extends Mod {
    constructor(value: number) {
        super([
            new BaseFireResistance(value),
            new BaseColdResistance(value)
        ]);
    }
}