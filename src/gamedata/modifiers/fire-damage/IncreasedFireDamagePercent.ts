import {Mod} from "../Mod";
import {FireDamagePercent} from "../../stats/fire-damage/FireDamagePercent";

export class IncreasedFireDamagePercent extends Mod {
    constructor(value: number) {
        super([
            new FireDamagePercent(value)
        ]);
    }
}