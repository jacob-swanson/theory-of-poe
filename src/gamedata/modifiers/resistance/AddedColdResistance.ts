import {Mod} from "../Mod";
import {mod} from "../ModParser";
import {BaseColdResistance} from "../../stats/resistance/BaseColdResistance";

@mod("#% to Cold Resistance")
export class AddedColdResistance extends Mod {
    constructor(value: number) {
        super([
            new BaseColdResistance(value)
        ]);
    }
}