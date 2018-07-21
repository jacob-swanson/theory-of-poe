import {Mod} from "../Mod";
import {AttackMinimumAddedFireDamage} from "../../stats/fire-damage/AttackMinimumAddedFireDamage";
import {AttackMaximumAddedFireDamage} from "../../stats/fire-damage/AttackMaximumAddedFireDamage";
import {mod} from "../ModParser";

@mod("Adds # to # Fire Damage to Attacks")
export class AddedAttackFireDamage extends Mod {
    constructor(min: number, max: number) {
        super([
            new AttackMinimumAddedFireDamage(min),
            new AttackMaximumAddedFireDamage(max)
        ]);
    }
}