import {Group} from "./Group";
import {Mod} from "./modifiers/Mod";
import {action, computed, observable} from "mobx";
import {bind} from "../utils/bind";
import {memoize} from "../utils/memoize";
import {Point} from "../web/react-pixi/ReactPIXIInternals";
import {Ascendancy, CharacterClass} from "./Character";
import {PassiveTree} from "./PassiveTree";

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
    isAscendancyStart: boolean;
    ascendancyName?: Ascendancy;
    className?: CharacterClass;
    description: string[];
}

interface ShortestPath {
    distance: number;
    path: Node[]
}

export class Node implements NodeProps {
    public group: Group = Group.Null;
    public readonly neighbors = new Set<Node>();
    @observable private _isHighlighted: boolean = false;

    constructor(public readonly id: string,
                public readonly name: string = "",
                public readonly orbit: number = 0,
                public readonly orbitIndex: number = 0,
                public readonly iconPath?: string,
                public readonly type: NodeType = NodeType.Normal,
                public readonly isAscendancyStart: boolean = false,
                public readonly ascendancyName?: Ascendancy,
                public readonly className?: CharacterClass,
                public readonly mods: Mod[] = []) {
    }

    public get isClassStart(): boolean {
        return !!this.className;
    }

    @memoize
    get position(): Point {
        const r = PassiveTree.orbitRadii[this.orbit];
        const theta = 2 * Math.PI * this.orbitIndex / PassiveTree.skillsPerOrbit[this.orbit] - Math.PI / 2;

        const x = r * Math.cos(theta) + this.group.x;
        const y = r * Math.sin(theta) + this.group.y;

        return {x, y};
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

    @bind
    @action
    public toggleAllocation() {
        this._isAllocated = !this._isAllocated;
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
        this._isHighlighted = false;
        for (const neighbor of this.neighbors) {
            if (neighbor._isHighlighted) {
                neighbor.hoverExit();
            }
        }
    }

    /**
     * Generates/retrieves a shortest path tree with the root being this node.
     */
    @memoize
    public getShortestPathTree(): Map<Node, ShortestPath> {
        const shortestPaths = new Map<Node, ShortestPath>();
        const visited = new Set<Node>();
        const unvisited = new Set<Node>();

        unvisited.add(this);
        shortestPaths.set(this, {distance: 0, path: []});

        while (unvisited.size > 0) {
            const currentNode = [...unvisited].reduce((closestNode, nextNode) => shortestPaths.get(nextNode)!.distance < shortestPaths.get(closestNode)!.distance ? nextNode : closestNode);
            unvisited.delete(currentNode);
            for (const neighborNode of currentNode.neighbors) {
                if (visited.has(neighborNode)) {
                    continue;
                }

                if (!shortestPaths.has(neighborNode)) {
                    shortestPaths.set(neighborNode, {distance: Infinity, path: []});
                }
                const isCloser = shortestPaths.get(currentNode)!.distance + 1 < shortestPaths.get(neighborNode)!.distance;
                if (isCloser) {
                    shortestPaths.get(neighborNode)!.distance = shortestPaths.get(currentNode)!.distance + 1;
                    shortestPaths.get(neighborNode)!.path = [...shortestPaths.get(currentNode)!.path, currentNode];
                }

                unvisited.add(neighborNode);
            }
            shortestPaths.get(currentNode)!.path.push(currentNode);
            visited.add(currentNode);
        }

        return new Map(
            [...shortestPaths.entries()].sort((a, b) => {
                const aDistance = a[1].distance;
                const bDistance = b[1].distance;
                if (aDistance > bDistance) {
                    return 1;
                } else if (aDistance < bDistance) {
                    return -1;
                }
                return 0;
            })
        );
    }

    @bind
    @action
    private highlightPath() {
        const shortestPathTree = this.getShortestPathTree();
        for (const [node, path] of shortestPathTree.entries()) {
            if (node.isAllocated) {
                path.path.forEach(node => node._isHighlighted = true);
                return;
            }
        }

    }

    @bind
    @action
    private highlightRemoval() {

    }
}