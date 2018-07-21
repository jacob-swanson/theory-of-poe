import {ValueStat} from "../ValueStat";

export class ChaosInoculation extends ValueStat<boolean> {
    constructor(value: boolean) {
        super(value);
    }
}