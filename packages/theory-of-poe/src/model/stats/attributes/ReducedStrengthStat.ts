import {IncreaseStrengthMod} from "./IncreaseStrengthMod";
import {mod} from "../ModParser";

@mod("#% reduced Strength")
export class ReducedStrengthStat extends IncreaseStrengthMod {
    constructor(value: number) {
        super(-1 * value);
    }
}