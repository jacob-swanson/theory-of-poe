import {Group} from "./Group";
import {Mod} from "./modifiers/Mod";
import {action, computed, observable} from "mobx";
import {bind} from "../utils/bind";
import {Point} from "../web/react-pixi/ReactPIXIInternals";
import {Ascendancy, CharacterClass} from "./Character";
import {PassiveTree} from "./PassiveTree";
import {memoize} from "../utils/memoize";
import * as Collections from "typescript-collections";
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

interface ShortestPath {
    distance: number;
    path: Node[]
}

export class Node implements NodeProps, Traversable {
    public group: Group = Group.Null;
    private readonly _neighbors = new Set<this>();

    @computed public get neighbors(): this[] {
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

    public addNeighbor(node: this) {
        this._neighbors.add(node);
    }

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

    public get isHighlighted(): boolean {
        return this._isHighlighted;
    }

    @observable private _isPendingRemoval: boolean = false;

    @computed get isPendingRemoval() {
        return this._isPendingRemoval;
    }

    public get isClassStart(): boolean {
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

    @observable private _isAllocated: boolean = false;

    @computed
    public get isAllocated(): boolean {
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

    public get allocatedNeighbors(): Node[] {
        const nodes = [];
        for (const node of this.neighbors) {
            if (node.isAllocated) {
                nodes.push(node);
            }
        }
        return nodes;
    }

    /**
     * Generates/retrieves a shortest path tree with the root being this node.
     */
    @computed
    public get shortestPathTree(): Map<Node, ShortestPath> {
        const shortestPaths = new Map<Node, ShortestPath>();
        const visited = new Set<Node>();
        const unvisited = new Set<Node>();

        unvisited.add(this);
        shortestPaths.set(this, {distance: 0, path: []});

        while (unvisited.size > 0) {
            const currentNode = [...unvisited].reduce((closestNode, nextNode) => shortestPaths.get(nextNode)!.distance < shortestPaths.get(closestNode)!.distance ? nextNode : closestNode);
            unvisited.delete(currentNode);
            for (const neighborNode of currentNode.neighbors) {
                // Connect Ascendant to other class starts only if ascendancy is allocated
                if (currentNode.ascendancyName !== neighborNode.ascendancyName) {
                    if (!neighborNode.ascendancyName || !neighborNode.isAllocated) {
                        continue;
                    }
                }

                // Don't allocate other class nodes via clicking
                if (neighborNode.isClassStart && !neighborNode.isAllocated) {
                    continue;
                }

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
    public toggleAllocation() {
        if (!this.isAllocated) {
            const paths = Dijkstras.getPathsToByMatch<Node>(this, node => node.isAllocated);
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
        this._isHighlighted = false;
        this._isPendingRemoval = false;
        for (const neighbor of this.neighbors) {
            if (neighbor._isHighlighted || neighbor._isPendingRemoval) {
                neighbor.hoverExit();
            }
        }
    }

    private dfs(otherNode: Node, nodes: Map<Node, { distance: number, previous: Node[] }>, path: Node[] = []): Node[][] {
        path.push(otherNode);

        const neighbors = nodes.get(otherNode)!.previous;
        if (neighbors.length > 0) {
            let results: Node[][] = [];
            for (const neighbor of neighbors) {
                const result = this.dfs(neighbor, nodes, [...path]);
                results = results.concat(result);
            }
            return results;
        } else {
            console.log(otherNode.id, path.map(node => node.id));
            return [path];
        }
    }

    @bind
    @action
    private highlightPath() {
        const paths = Dijkstras.getPathsToByMatch<Node>(this, node => node.isAllocated);
        for (const path of paths) {
            for (const node of path) {
                node._isHighlighted = true;
            }
        }
        // const shortestPathTree = this.shortestPathTree;
        // let pathLength = Infinity;
        // for (const [node, path] of shortestPathTree.entries()) {
        //     if (node.isAllocated) {
        //         if (path.path.length <= pathLength) {
        //             pathLength = path.path.length;
        //             path.path.forEach(node => node._isHighlighted = true);
        //         } else {
        //             return;
        //         }
        //     }
        // }
    }

    @bind
    @action
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