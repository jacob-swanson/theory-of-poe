import {Mod} from "../Mod";
import {mod} from "../ModParser";
import {BaseStrength} from "../../stats/attributes/BaseStrength";
import {BaseDexterity} from "../../stats/attributes/BaseDexterity";
import {BaseIntelligence} from "../../stats/attributes/BaseIntelligence";

@mod("Adds # to BaseIntelligence")
export class AddedIntelligence extends Mod {
    constructor(value: number) {
        super([
            new BaseIntelligence(value)
        ]);
    }
}