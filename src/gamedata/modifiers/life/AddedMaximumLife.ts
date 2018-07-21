import {Mod} from "../Mod";
import {BaseMaximumLife} from "../../stats/life/BaseMaximumLife";
import {mod} from "../ModParser";

@mod("# to maximum Life")
export class AddedMaximumLife extends Mod {
    constructor(value: number) {
        super([
            new BaseMaximumLife(value)
        ]);
    }
}