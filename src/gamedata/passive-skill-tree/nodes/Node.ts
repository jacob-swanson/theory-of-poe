import {Position} from "../../Position";

export class Node {
    constructor(
        public readonly position: Position,
        public readonly iconUrl: string,
        public readonly frameUrl?: string,
    ) {

    }
}