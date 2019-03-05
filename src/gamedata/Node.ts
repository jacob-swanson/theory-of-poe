import {Group} from "./Group";
import {Mod} from "./modifiers/Mod";
import {action, computed, observable} from "mobx";
import {bind} from "../utils/bind";
import {Point} from "../web/react-pixi/ReactPIXIInternals";
import {Ascendancy, CharacterClass} from "./Character";
import {PassiveTree} from "./PassiveTree";
import {memoize} from "../utils/memoize";
import {Dijkstras, Traversable} from "../utils/algorithms/Dijkstras";

export enum NodeAllocationState {
    Unallocated,
    Allocated,
    CanAllocate
}

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

export interface NodeProps {
    id: string;
    name: string;
    orbit: number;
    orbitIndex: number;
    iconPath?: string;
    type: NodeType;
    ascendancyName?: Ascendancy;
    className?: CharacterClass;
    description: string[];
}

export class Node implements NodeProps, Traversable {
    public group: Group = Group.Null;
    private readonly _neighbors = new Set<this>();

    constructor(public readonly id: string,
                public readonly name: string = "",
                public readonly orbit: number = 0,
                public readonly orbitIndex: number = 0,
                public readonly iconPath?: string,
                public readonly type: NodeType = NodeType.Normal,
                public readonly ascendancyName?: Ascendancy,
                public readonly className?: CharacterClass,
                public readonly mods: Mod[] = []) {
    }

    @observable private _isHighlighted: boolean = false;

    @computed get isHighlighted(): boolean {
        return this._isHighlighted;
    }

    @computed get neighbors(): this[] {
        const neighborNodes: this[] = [];
        for (const neighborNode of this._neighbors) {
            // Connect Ascendant to other class starts only if ascendancy is allocated
            if (this.ascendancyName !== neighborNode.ascendancyName) {
                if (!neighborNode.ascendancyName || !neighborNode.isAllocated) {
                    continue;
                }
            }
            // Don't allocate other class nodes via clicking
            if (neighborNode.isClassStart && !neighborNode.isAllocated) {
                continue;
            }
            neighborNodes.push(neighborNode);
        }
        return neighborNodes;

    }

    @observable private _isPendingRemoval: boolean = false;

    @computed get isPendingRemoval() {
        return this._isPendingRemoval;
    }

    @computed get isClassStart(): boolean {
        return !!this.className;
    }

    @memoize
    public get position(): Point {
        const r = PassiveTree.orbitRadii[this.orbit];
        const theta = 2 * Math.PI * this.orbitIndex / PassiveTree.skillsPerOrbit[this.orbit] - Math.PI / 2;

        const x = r * Math.cos(theta) + this.group.x;
        const y = r * Math.sin(theta) + this.group.y;

        return {x, y};
    }

    /**
     * Get the radius of the graphics asset for this node.
     */
    public get radius(): number {
        switch (this.type) {
            case NodeType.JewelSocket:
            case NodeType.AscendancyLarge:
            case NodeType.Notable:
                return 29;
            case NodeType.Keystone:
                return 42.5;
            case NodeType.AscendancyStart:
            case NodeType.AscendancySmall:
            case NodeType.Normal:
                return 20;
            default:
                throw new Error(`Radius missing for node.type=${this.type}`);
        }
    }

    @observable private _isAllocated: boolean = false;

    @computed get isAllocated(): boolean {
        if (this._isAllocated) {
            return true;
        }

        if (this.className && this.className === this.group.passiveTree.character.className) {
            return true;
        }

        if (this.ascendancyName && this.type === NodeType.AscendancyStart) {
            if (this.group.passiveTree.character.ascendancyName === this.ascendancyName) {
                return true;
            }
        }

        return false;
    }

    @computed get description(): string[] {
        return this.mods.flatMap(mod => mod.getDescription());
    }

    @computed get isAscendancy(): boolean {
        return !!this.ascendancyName;
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
            const isCurrentAscendancy = this.ascendancyName === this.group.passiveTree.character.ascendancyName;
            if (!isCurrentAscendancy) {
                return false;
            }
        }

        return true;
    }

    public addNeighbor(node: this) {
        this._neighbors.add(node);
    }

    @bind
    @action
    public toggleAllocation() {
        if (!this.isAllocated) {
            const paths = Dijkstras.getPathsByMatch<Node>(this, node => node.isAllocated);
            paths[0].forEach(node => node._isAllocated = true);
        } else {
            this._isAllocated = false;
            for (const neighborNode of this.neighbors) {
                if (neighborNode.isPendingRemoval && neighborNode.isAllocated) {
                    neighborNode.toggleAllocation();
                }
            }
        }

    };

    @bind
    @action
    public hoverEnter() {
        if (this.isAllocated) {
            this.highlightRemoval();
        } else {
            this.highlightPath();
        }
    }

    @bind
    @action
    public hoverExit() {
        this.traverse(
            node => {
                node._isHighlighted = false;
                node._isPendingRemoval = false;
            },
            node => node._isHighlighted || node._isPendingRemoval
        );
    }

    @bind
    private highlightPath() {
        const paths = Dijkstras.getPathsByMatch<Node>(this, node => node.isAllocated);
        for (const node of paths[0]) {
            node._isHighlighted = true;
        }
    }

    @bind
    private highlightRemoval() {
        const classStartNode = this.group.passiveTree.classStartNode;
        const connectedNodes = new Set<Node>();
        classStartNode.traverse(
            node => connectedNodes.add(node),
            node => node.isAllocated && node !== this
        );
        this.traverse(
            node => node._isPendingRemoval = true,
            node => node.isAllocated && !connectedNodes.has(node)
        );
    }

    private traverse(callback: (node: Node) => void, filter: (node: Node) => boolean = () => true) {
        const visited = new Set<string>();
        const stack: Node[] = [this];
        while (stack.length > 0) {
            const node = stack.pop()!;
            if (visited.has(node.id)) {
                continue;
            }
            if (!filter(node)) {
                continue;
            }

            visited.add(node.id);
            callback(node);

            for (const neighborNode of node.neighbors) {
                stack.push(neighborNode);
            }
        }
    }
}