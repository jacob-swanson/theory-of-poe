import {Position} from "../Position";
import {ValueMod} from "../stats/ValueMod";

export class Node {
    constructor(
        public readonly position: Position,
        public readonly iconUrl: string,
        public readonly frameUrl?: string,
    ) {

    }
}