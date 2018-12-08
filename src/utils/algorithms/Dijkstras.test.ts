import {Dijkstras, Traversable} from "./Dijkstras";

class GraphNode implements Traversable {
    public readonly neighbors: this[] = [];

    constructor(public readonly id: string) {
    }
}

describe("Dijkstras", () => {
    it("get all shortest paths", () => {
        const node1 = new GraphNode("1");
        const node2 = new GraphNode("2");
        const node3 = new GraphNode("3");
        const node4 = new GraphNode("4");
        const node5 = new GraphNode("5");
        const node6 = new GraphNode("6");

        node1.neighbors.push(node2);
        node1.neighbors.push(node3);
        node2.neighbors.push(node1);
        node2.neighbors.push(node4);
        node3.neighbors.push(node1);
        node3.neighbors.push(node4);
        node4.neighbors.push(node2);
        node4.neighbors.push(node3);
        node4.neighbors.push(node5);
        node5.neighbors.push(node4);
        node5.neighbors.push(node6);
        node6.neighbors.push(node5);

        const shortestPathTree = Dijkstras.createShortestPathTree(node4, () => false);
        expect(shortestPathTree.getPathsTo(node1)).toEqual([
            [node4, node2, node1],
            [node4, node3, node1]
        ]);
        expect(shortestPathTree.getPathsTo(node6)).toEqual([
            [node4, node5, node6]
        ]);
        expect(shortestPathTree.getPathsByMatch(node => node === node1).map(path => path.map(node => node.id))).toEqual([
            ["4", "2", "1"],
            ["4", "3", "1"]
        ]);
    });
});