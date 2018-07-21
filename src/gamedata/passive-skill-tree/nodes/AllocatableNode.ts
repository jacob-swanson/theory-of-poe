import {Node} from "./Node";
import {Position} from "../../Position";
import {observable} from "mobx";
import {Mod} from "../../modifiers/Mod";

export class AllocatableNode extends Node {
    @observable public allocated: boolean = false;

    constructor(position: Position, iconUrl: string, frameUrl?: string, public readonly stats: Mod[] = []) {
        super(position, iconUrl, frameUrl);
    }
}