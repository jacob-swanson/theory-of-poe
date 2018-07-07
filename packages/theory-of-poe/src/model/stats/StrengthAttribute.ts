import {Character} from "../Character";
import {AddStrengthMod} from "./attributes/AddStrengthMod";
import {IncreaseStrengthMod} from "./attributes/IncreaseStrengthMod";
import {MoreStrengthMod} from "./attributes/MoreStrengthMod";

export class StrengthAttribute {
    constructor(protected character: Character) {
    }

    get value(): number {
        const value = this.character.sumStatByType(AddStrengthMod);
        const increasedMultiplier = this.character.sumStatByType(IncreaseStrengthMod);
        const moreMultiplier = this.character.multiplyStatByType(MoreStrengthMod);

        return value * (1 + increasedMultiplier / 100) * (1 + moreMultiplier / 100);
    }
}