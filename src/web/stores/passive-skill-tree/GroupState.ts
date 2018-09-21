import {NodeState} from "./NodeState";
import {Point} from "../../webgl/ReactPIXIInternals";
import {PassiveTreeState} from "./PassiveTreeState";

export enum GroupStateBackground {
    None,
    Small,
    Medium,
    Large
}

export class GroupState {
    public readonly nodes: NodeState[] = [];
    public passiveTree: PassiveTreeState;

    constructor(public readonly id: string,
                public readonly position: Point,
                public readonly background: GroupStateBackground) {
    }
}