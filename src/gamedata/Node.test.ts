import {Node} from "./Node";

describe("Node", () => {
    it("shortest path works", () => {
        const node1 = new Node("1");
        const node2 = new Node("2");
        const node3 = new Node("3");
        const node4 = new Node("4");
        const node5 = new Node("5");
        const node6 = new Node("6");

        node1.neighbors.add(node2);
        node1.neighbors.add(node3);
        node1.neighbors.add(node4);
        node2.neighbors.add(node1);
        node2.neighbors.add(node3);
        node2.neighbors.add(node5);
        node3.neighbors.add(node2);
        node3.neighbors.add(node1);
        node3.neighbors.add(node6);
        node4.neighbors.add(node1);
        node5.neighbors.add(node2);
        node6.neighbors.add(node3);

        const shortestPaths = node4.shortestPathTree;
        expect(shortestPaths).toBeTruthy();
    });
});