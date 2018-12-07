import {PassiveTreeResponse} from "./passive-skill-tree/internal-data/PassiveTreeResponse";
import {PassiveTree} from "./PassiveTree";
import {Group} from "./Group";
import {Node} from "./Node";

export class PassiveTreeFactory {
    public static create(passiveTreeData: PassiveTreeResponse): PassiveTree {
        return new PassiveTree(
            this.createGroups(passiveTreeData),
            passiveTreeData.assets,
            passiveTreeData.skillSprites,
            passiveTreeData.classArt,
            passiveTreeData.version
        );
    }

    private static createGroups(passiveTreeData: PassiveTreeResponse): Map<string, Group> {
        const nodes = this.createNodes(passiveTreeData);
        const groups = new Map<string, Group>();
        for (const groupData of passiveTreeData.groups) {
            groups.set(
                groupData.id,
                new Group(
                    groupData.id,
                    groupData.x,
                    groupData.y,
                    groupData.nodes.map(nodeData => nodes.get(nodeData.id)!)
                )
            );
        }
        return groups;
    }

    private static createNodes(passiveTreeData: PassiveTreeResponse): Map<string, Node> {
        const nodes = new Map<string, Node>();
        for (const groupData of passiveTreeData.groups) {
            for (const nodeData of groupData.nodes) {
                nodes.set(
                    nodeData.id,
                    new Node(
                        nodeData.id,
                        nodeData.name,
                        nodeData.orbit,
                        nodeData.orbitIndex,
                        nodeData.icon,
                        nodeData.type,
                        nodeData.ascendancyName,
                        nodeData.className
                    )
                );
            }
        }
        for (const groupData of passiveTreeData.groups) {
            for (const nodeData of groupData.nodes) {
                const node = nodes.get(nodeData.id)!;
                for (const id of nodeData.neighbors) {
                    const neighborNode = nodes.get(id)!;
                    node.addNeighbor(neighborNode);
                    neighborNode.addNeighbor(node);
                }
            }
        }
        return nodes;
    }
}