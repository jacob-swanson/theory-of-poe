import {Mod} from "../Mod";
import {mod} from "../ModParser";
import {BaseFireResistance} from "../../stats/resistance/BaseFireResistance";

@mod("#% to Fire Resistance")
export class AddedFireResistance extends Mod {
    constructor(value: number) {
        super([
            new BaseFireResistance(value)
        ]);
    }
}