import {GroupState} from "./GroupState";
import {Point} from "../../webgl/ReactPIXIInternals";
import {action, computed, observable} from "mobx";
import {ConsoleLogger} from "../../../utils/logger/ConsoleLogger";
import {Dictionary} from "../../../utils/Dictionary";

const log = new ConsoleLogger("NodeState");

export enum NodeType {
    Mastery = "Mastery",
    Notable = "Notable",
    Keystone = "Keystone",
    Normal = "Normal",
    AscendancyStart = "AscendancyStart",
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
    Witch = "Witch",
    Shadow = "Shadow",
    Ranger = "Ranger",
    Duelist = "Duelist",
    Marauder = "Marauder",
    Templar = "Templar",
    Scion = "Scion"
}

export const CharacterClassesBySpc: CharacterClass[] = [
    CharacterClass.Witch,
    CharacterClass.Shadow,
    CharacterClass.Ranger,
    CharacterClass.Duelist,
    CharacterClass.Marauder,
    CharacterClass.Templar,
    CharacterClass.Scion
];

export enum Ascendancy {
    Slayer = "Slayer",
    Gladiator = "Gladiator",
    Champion = "Champion",
    Assassin = "Assassin",
    Saboteur = "Saboteur",
    Trickster = "Trickster",
    Juggernaut = "Juggernaut",
    Berserker = "Berserker",
    Chieftain = "Chieftain",
    Necromancer = "Necromancer",
    Elementalist = "Elementalist",
    Occultist = "Occultist",
    Deadeye = "Deadeye",
    Raider = "Raider",
    Pathfinder = "Pathfinder",
    Inquisitor = "Inquisitor",
    Hierophant = "Hierophant",
    Guardian = "Guardian",
    Ascendant = "Ascendant"
}

export const AscendanciesByClass: Dictionary<Ascendancy[]> = {
    [CharacterClass.Duelist]: [
        Ascendancy.Slayer,
        Ascendancy.Gladiator,
        Ascendancy.Champion
    ],
    [CharacterClass.Shadow]: [
        Ascendancy.Assassin,
        Ascendancy.Saboteur,
        Ascendancy.Trickster
    ],
    [CharacterClass.Marauder]: [
        Ascendancy.Juggernaut,
        Ascendancy.Berserker,
        Ascendancy.Chieftain
    ],
    [CharacterClass.Witch]: [
        Ascendancy.Necromancer,
        Ascendancy.Elementalist,
        Ascendancy.Occultist
    ],
    [CharacterClass.Ranger]: [
        Ascendancy.Deadeye,
        Ascendancy.Raider,
        Ascendancy.Pathfinder
    ],
    [CharacterClass.Templar]: [
        Ascendancy.Inquisitor,
        Ascendancy.Hierophant,
        Ascendancy.Guardian
    ],
    [CharacterClass.Scion]: [
        Ascendancy.Ascendant
    ]
};

export class NodeState {
    public readonly connections = new Set<NodeState>();

    public group: GroupState;

    @action public toggleAllocated = () => {
        this._isAllocated = !this._isAllocated;
    };

    constructor(public readonly id: string,
                public readonly name: string,
                public readonly orbit: number,
                public readonly orbitIndex: number,
                public readonly icon: string,
                public readonly type: NodeType,
                public readonly ascendancyName: string | null,
                public readonly className: CharacterClass | null) {
    }

    @observable private _isAllocated: boolean = false;

    @computed get isAllocated(): boolean {
        return this._isAllocated || this.className === this.group.passiveTree.character.className;
    }

    @computed get position(): Point {
        const r = this.group.passiveTree.orbitRadii[this.orbit];
        const theta = 2 * Math.PI * this.orbitIndex / this.group.passiveTree.skillsPerOrbit[this.orbit] - Math.PI / 2;

        const x = r * Math.cos(theta) + this.group.position.x;
        const y = r * Math.sin(theta) + this.group.position.y;

        return {x, y};
    }

    @computed get isAllocatable(): boolean {
        const isMastery = this.type === NodeType.Mastery;
        if (isMastery) {
            return false;
        }

        const isClassStart = this.type === NodeType.ClassStart;
        if (isClassStart) {
            return false;
        }

        const isAscendancyStart = this.type === NodeType.AscendancyStart;
        if (isAscendancyStart) {
            return false;
        }

        if (this.ascendancyName) {
            const isCurrentAscendancy =  this.ascendancyName === this.group.passiveTree.character.ascendancy;
            if (!isCurrentAscendancy) {
                return false;
            }
        }

        return true;
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
        return this.className !== null;
    }
}