import {Mod} from "../Mod";
import {MaximumLifePercent} from "../../stats/life/MaximumLifePercent";
import {mod} from "../ModParser";

@mod("#% increased maximum Life")
export class IncreasedMaximumLifePercent extends Mod {
    constructor(value: number) {
        super([
            new MaximumLifePercent(value)
        ]);
    }
}