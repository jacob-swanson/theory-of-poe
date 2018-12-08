import {PriorityQueue} from "typescript-collections";
import {ICompareFunction} from "typescript-collections/dist/lib/util";

export interface Traversable {
    readonly neighbors: Iterable<this>;
}

export class ShortestPathTree<T extends Traversable> {
    public constructor(
        /**
         * Source node for the shortest path tree.
         */
        public readonly sourceNode: T,
        /**
         * The shortest path tree.
         */
        private readonly nodes: Map<T, Traversal<T>>
    ) {
    }

    /**
     * Get all shortest paths leading from the source node to the given node.
     * @param toNode
     */
    public getPathsTo(toNode: T): T[][] {
        return this.traverseShortestPathTree(
            node => node === toNode,
            this.sourceNode
        );
    }

    /**
     * Get all shortest paths leading from the source node to a node that matches.
     * @param isMatch Return true if the given node is the node being searched for, false otherwise.
     */
    public getPathsByMatch(isMatch: (node: T) => boolean): T[][] {
        return this.traverseShortestPathTree(isMatch, this.sourceNode);
    }

    /**
     * Use DFS to traverse the shortest path tree.
     * @param isMatch
     * @param currentNode
     * @param path
     */
    private traverseShortestPathTree(isMatch: (node: T) => boolean, currentNode: T, path: T[] = []): T[][] {
        path.push(currentNode);

        const shortestPaths: T[][] = [];

        if (isMatch(currentNode)) {
            shortestPaths.push([...path]);
        }

        const childNodes = this.nodes.get(currentNode)!.children;
        if (childNodes.length > 0) {
            for (const childNode of childNodes) {
                const childPaths =
                shortestPaths.push(...this.traverseShortestPathTree(isMatch, childNode, [...path]));
            }
        }

        // Remove longer paths
        const shortestPathLength = Math.min(...shortestPaths.map(path => path.length));
        return shortestPaths.filter(path => path.length <= shortestPathLength);
    }

}

interface Traversal<T> {
    /**
     * Distance between the source node and this node.
     */
    distance: number;
    /**
     * Parents of this node. The source node has no parents.
     */
    parents: T[];
    /**
     * Children of this node.
     */
    children: T[];
}

export class Dijkstras {
    /**
     * Create a shortest path tree.
     * @param sourceNode
     * @param isMatch
     */
    public static createShortestPathTree<T extends Traversable>(sourceNode: T, isMatch: (node: T) => boolean): ShortestPathTree<T> {
        const nodes = new Map<T, Traversal<T>>();
        nodes.set(sourceNode, {distance: 0, parents: [], children: []});

        const queue = new PriorityQueue<T>(this.createCompareFunction(nodes));
        queue.enqueue(sourceNode);

        while (!queue.isEmpty()) {
            const closestNode = queue.dequeue()!;
            if (isMatch(closestNode)) {
                return new ShortestPathTree<T>(sourceNode, nodes);
            }
            for (const neighborNode of closestNode.neighbors) {
                if (!nodes.has(neighborNode)) {
                    nodes.set(neighborNode, {distance: Infinity, parents: [], children: []});
                }

                const alt = nodes.get(closestNode)!.distance + 1;
                if (alt < nodes.get(neighborNode)!.distance) {
                    nodes.get(neighborNode)!.distance = alt;
                    nodes.get(neighborNode)!.parents.push(closestNode);
                    nodes.get(closestNode)!.children.push(neighborNode);
                    queue.enqueue(neighborNode);
                } else if (alt === nodes.get(neighborNode)!.distance) {
                    nodes.get(neighborNode)!.parents.push(closestNode);
                    nodes.get(closestNode)!.children.push(neighborNode);
                }
            }
        }

        return new ShortestPathTree<T>(sourceNode, nodes);
    }

    public static getPathsByMatch<T extends Traversable>(sourceNode: T, isMatch: (node: T) => boolean): T[][] {
        const shortestPathTree = this.createShortestPathTree(sourceNode, isMatch);
        return shortestPathTree.getPathsByMatch(isMatch);
    }

    /**
     * Create compare function used by the priority queue.
     * @param nodes
     */
    private static createCompareFunction<T extends Traversable>(nodes: Map<T, Traversal<T>>): ICompareFunction<T> {
        return (a: T, b: T) => {
            if (nodes.get(a)!.distance! > nodes.get(b)!.distance!) {
                return -1;
            } else if (nodes.get(a)!.distance! < nodes.get(b)!.distance!) {
                return 1;
            }
            return 0;
        };
    }
}