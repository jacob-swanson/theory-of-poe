import {Mod} from "../Mod";
import {mod} from "../ModParser";
import {BaseChaosResistance} from "../../stats/resistance/BaseChaosResistance";

@mod("#% to Chaos Resistance")
export class AddedChaosResistance extends Mod {
    constructor(value: number) {
        super([
            new BaseChaosResistance(value)
        ]);
    }
}