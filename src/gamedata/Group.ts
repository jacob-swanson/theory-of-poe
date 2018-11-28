import {PassiveTree} from "./PassiveTree";
import {Node} from "./Node";
import {Dictionary} from "../utils/Dictionary";
import {Ascendancy} from "./Character";
import {Position} from "./Position";

export enum GroupBackgroundType {
    Hidden = "Hidden",
    Small = "Small",
    Medium = "Medium",
    Large = "Large",
    Ascendancy = "Ascendancy"
}

export class Group {
    public static readonly Null = new Group("", 0, 0, []);

    public passiveTree: PassiveTree = PassiveTree.Null;

    constructor(public readonly id: string,
                public readonly x: number,
                public readonly y: number,
                public readonly nodes: Node[]) {
        nodes.forEach(node => node.group = this);
    }

    public get position(): Position {
        return new Position(this.x, this.y);
    }

    public get ascendancyName(): Ascendancy | undefined {
        if (this.nodes.length <= 0) {
            return undefined;
        }

        return this.nodes[0].ascendancyName;
    }

    public get containsAscendancyStart(): boolean {
        for (const node of this.nodes) {
            if (node.isAscendancyStart) {
                return true;
            }
        }

        return false;
    }

    private get occupiedOrbits(): Dictionary<boolean> {
        const occupiedOrbits = {};
        this.nodes.forEach(node => occupiedOrbits[node.orbit] = true);
        return occupiedOrbits;
    }

    public getBackgroundType(): GroupBackgroundType {
        if (this.ascendancyName && this.containsAscendancyStart) {
            return GroupBackgroundType.Ascendancy;
        }

        const occupiedOrbits = this.occupiedOrbits;
        if (occupiedOrbits[3]) {
            return GroupBackgroundType.Large;
        } else if (occupiedOrbits[2]) {
            return GroupBackgroundType.Medium;
        } else if (occupiedOrbits[1]) {
            return GroupBackgroundType.Small;
        }
        return GroupBackgroundType.Hidden;
    }
}