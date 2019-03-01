import {Character} from "./Character";
import {Group} from "./Group";
import {Node} from "./Node";
import {Dictionary} from "../utils/Dictionary";
import {ClassArtResponse} from "./passive-skill-tree/internal-data/ClassArtResponse";
import {Point} from "../web/react-pixi/ReactPIXIInternals";
import {computed, observable} from "mobx";
import {LoggerFactory} from "../utils/logger/LoggerFactory";

const log = LoggerFactory.getLogger("PassiveTree");

export class PassiveTreeTooltip {
    @observable
    public node?: Node = undefined;

    @observable
    public scale: Point = {
        x: 1,
        y: 1
    };

    @observable
    public worldPosition: Point = {
        x: 0,
        y: 0
    };

    @computed get position(): Point {
        if (!this.node) {
            return {x: 0, y: 0};
        }
        return {
            x: this.node.position.x * this.scale.x + this.worldPosition.x,
            y: this.node.position.y * this.scale.y + this.worldPosition.y
        };
    }
}

export class PassiveTree {
    public static readonly Null = new PassiveTree(
        new Map(),
        {},
        {},
        [],
        ""
    );

    public static readonly skillsPerOrbit: number[] = [
        1,
        6,
        12,
        12,
        40
    ];

    public static readonly orbitRadii: number[] = [
        0,
        82 * 0.3835,
        162 * 0.3835,
        335 * 0.3835,
        493 * 0.3835
    ];


    public character: Character;
    public isDragging: boolean;
    public readonly tooltip = new PassiveTreeTooltip();

    constructor(
        public readonly groups: Map<string, Group>,
        public readonly assets: Dictionary<string>,
        public readonly skillSprites: Dictionary<string>,
        public readonly classArt: ClassArtResponse[],
        public readonly version: string
    ) {
        groups.forEach(group => group.passiveTree = this);
    }

    public get groupsList(): Group[] {
        const groups = [];
        for (const group of this.groups.values()) {
            groups.push(group);
        }
        return groups;
    }

    @computed
    public get nodes(): Node[] {
        const nodes = [];
        for (const group of this.groups.values()) {
            for (const node of group.nodes) {
                nodes.push(node);
            }
        }
        return nodes;
    }

    @computed
    public get allocatedNodes(): Node[] {
        const nodes = [];
        for (const node of this.nodes) {
            if (node.isAllocated) {
                nodes.push(node);
            }
        }
        return nodes;
    }

    @computed
    public get allocatedAscendancyNodes(): Node[] {
        const nodes = [];
        for (const node of this.nodes) {
            if (node.isAllocated && node.isAscendancy) {
                nodes.push(node);
            }
        }
        return nodes;
    }

    @computed
    public get classStartNode(): Node {
        for (const node of this.allocatedNodes) {
            if (node.isClassStart) {
                return node;
            }
        }
        throw new Error("No class node was allocated");
    }
}