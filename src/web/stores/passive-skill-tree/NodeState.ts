import {GroupState} from "./GroupState";
import {Point} from "../../webgl/ReactPIXIInternals";
import {action, computed, observable} from "mobx";
import {ConsoleLogger} from "../../../utils/logger/ConsoleLogger";

const log = new ConsoleLogger("NodeState");

export enum NodeType {
    Mastery = "Mastery",
    Notable = "Notable",
    Keystone = "Keystone",
    Normal = "Normal",
    AscendancySmall = "AscendancySmall",
    AscendancyLarge = "AscendancyLarge",
    ClassStart = "ClassStart",
    JewelSocket = "JewelSocket"
}

export enum NodeAllocationState {
    Unallocated,
    Allocated,
    CanAllocate
}

export enum CharacterClass {
    Witch = 3,
    Shadow = 6,
    Ranger = 2,
    Duelist = 4,
    Marauder = 1,
    Templar = 5,
    Scion = 0
}

export class NodeState {
    public readonly connections = new Set<NodeState>();
    public group: GroupState;

    @observable public isAllocated: boolean = false;

    @action public toggleAllocated = () => {
        this.isAllocated = !this.isAllocated;
    };

    constructor(public readonly id: string,
                public readonly name: string,
                public readonly orbit: number,
                public readonly orbitIndex: number,
                public readonly icon: string,
                public readonly type: NodeType,
                public readonly isAscendancyStart: boolean,
                public readonly ascendancyName: string | null,
                public readonly characterClassName: CharacterClass | null) {
    }

    get position(): Point {
        const r = this.group.passiveTree.orbitRadii[this.orbit];
        const theta = 2 * Math.PI * this.orbitIndex / this.group.passiveTree.skillsPerOrbit[this.orbit] - Math.PI / 2;

        const x = r * Math.cos(theta) + this.group.position.x;
        const y = r * Math.sin(theta) + this.group.position.y;

        return {x, y};
    }

    get isAllocatable(): boolean {
        return this.type !== NodeType.Mastery && this.type !== NodeType.ClassStart && !this.isAscendancyStart;
    }

    @computed get canAllocate(): boolean {
        for (const node of this.connections.values()) {
            if (node.isAllocated) {
                return true;
            }
        }
        return false;
    }

    @computed get state(): NodeAllocationState {
        if (this.isAllocated) {
            return NodeAllocationState.Allocated;
        } else if (this.canAllocate) {
            return NodeAllocationState.CanAllocate;
        } else {
            return NodeAllocationState.Unallocated;
        }
    }

    @computed get isClassStart(): boolean {
        return this.characterClassName !== null;
    }
}