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

    get ascendancyName(): string | null {
        for (const node of this.nodes) {
            if (node.ascendancyName) {
                return node.ascendancyName;
            }
        }
        return null;
    }

    get isAscendancyStart(): boolean {
        for (const node of this.nodes) {
            if (node.isAscendancyStart) {
                return true;
            }
        }
        return false;
    }
}