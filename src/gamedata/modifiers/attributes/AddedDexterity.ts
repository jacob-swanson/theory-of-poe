import {Mod} from "../Mod";
import {mod} from "../ModParser";
import {BaseStrength} from "../../stats/attributes/BaseStrength";
import {BaseDexterity} from "../../stats/attributes/BaseDexterity";

@mod("Adds # to BaseDexterity")
export class AddedDexterity extends Mod {
    constructor(value: number) {
        super([
            new BaseDexterity(value)
        ]);
    }
}