import {Mod} from "../Mod";
import {mod} from "../ModParser";
import {BaseStrength} from "../../stats/attributes/BaseStrength";

@mod("Adds # to BaseStrength")
export class AddedStrength extends Mod {
    constructor(value: number) {
        super([
            new BaseStrength(value)
        ]);
    }
}