import {Node} from "./Node";
import {ValueMod} from "../stats/ValueMod";
import {Position} from "../Position";
import {observable} from "mobx";

export class AllocatableNode extends Node {
    @observable allocated: boolean = false;

    constructor(position: Position, iconUrl: string, frameUrl?: string, public readonly stats: ValueMod[] = []) {
        super(position, iconUrl, frameUrl);
    }
}