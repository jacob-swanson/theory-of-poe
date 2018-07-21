import {Mod} from "../Mod";
import {ChaosInoculation} from "../../stats/keystones/ChaosInoculation";
import {mod} from "../ModParser";

@mod("Maximum Life becomes 1, Immune to Chaos Damage")
export class ChaosInoculationKeystone extends Mod {
    constructor() {
        super([
            new ChaosInoculation(true)
        ]);
    }
}