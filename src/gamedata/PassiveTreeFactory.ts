import {Node, NodeType} from "./Node";
import {PassiveSkillTreeRootJson} from "./passive-skill-tree/external-data/PassiveSkillTreeRootJson";
import {Group} from "./Group";
import {PassiveTree} from "./PassiveTree";
import {NodeJson} from "./passive-skill-tree/external-data/NodeJson";
import {Ascendancy, CharacterClass} from "./Character";

/**
 * Create groups and populate with nodes.
 *
 * @param json
 * @param nodes
 */
function createGroups(json: PassiveSkillTreeRootJson, nodes: Map<string, Node>): Map<string, Group> {
    const groups = new Map<string, Group>();
    for (const [groupId, groupJson] of Object.entries(json.passiveSkillTreeData.groups)) {
        const group = new Group(
            groupId,
            groupJson.x * 0.3835,
            groupJson.y * 0.3835,
            groupJson.n.map(nodeId => nodes.get(nodeId.toString())!)
        );
        groups.set(groupId, group);
    }
    return groups;
}

function getNodeType(nodeJson: NodeJson): NodeType {
    if (nodeJson.isAscendancyStart) {
        return NodeType.AscendancyStart;
    } else if (nodeJson.spc.length > 0) {
        return NodeType.ClassStart;
    } else if (nodeJson.isJewelSocket) {
        return NodeType.JewelSocket;
    } else if (nodeJson.m) {
        return NodeType.Mastery;
    } else if (nodeJson.ks) {
        return NodeType.Keystone;
    } else if (nodeJson.not) {
        return nodeJson.ascendancyName ? NodeType.AscendancyLarge : NodeType.Notable;
    } else {
        return nodeJson.ascendancyName ? NodeType.AscendancySmall : NodeType.Normal;
    }
}

/**
 * Get name of the starting class.
 *
 * @param spc
 */
function spcToClass(spc: number[]): CharacterClass | undefined {
    if (spc.length !== 1) {
        return undefined;
    }

    const spcToClass = [
        CharacterClass.Scion,
        CharacterClass.Marauder,
        CharacterClass.Ranger,
        CharacterClass.Witch,
        CharacterClass.Duelist,
        CharacterClass.Templar,
        CharacterClass.Shadow
    ];

    return spcToClass[spc[0]];
}

/**
 * Create nodes and connect them together.
 *
 * @param json
 */
function createNodes(json: PassiveSkillTreeRootJson): Map<string, Node> {
    const nodes = new Map<string, Node>();
    for (const [nodeId, nodeJson] of Object.entries(json.passiveSkillTreeData.nodes)) {
        nodes.set(
            nodeId,
            new Node(
                nodeId,
                nodeJson.dn,
                nodeJson.o,
                nodeJson.oidx,
                nodeJson.icon,
                getNodeType(nodeJson),
                nodeJson.isAscendancyStart,
                Ascendancy[nodeJson.ascendancyName],
                spcToClass(nodeJson.spc)
            )
        );
    }
    for (const [nodeId, nodeJson] of Object.entries(json.passiveSkillTreeData.nodes)) {
        const node = nodes.get(nodeId)!;
        for (const neighborId of nodeJson.out) {
            const neighborNode = nodes.get(neighborId.toString())!;
            node.neighbors.add(neighborNode);
            neighborNode.neighbors.add(node);
        }
    }
    return nodes;
}

/**
 * Create the root passive tree.
 *
 * @param json
 * @param groups
 */
function createPassiveTree(json: PassiveSkillTreeRootJson, groups: Map<string, Group>): PassiveTree {
    return new PassiveTree(
        groups,
        json.passiveSkillTreeData.skillSprites
    );
}

function generateShortestPaths(nodes: Map<string, Node>) {
    for (const node of nodes.values()) {
        node.getShortestPathTree();
    }
}


export const PassiveTreeFactory = {
    /**
     * Convert GGG's passive tree data to ours.
     *
     * @param json
     */
    create: (json: PassiveSkillTreeRootJson): PassiveTree => {
        const nodes = createNodes(json);
        const groups = createGroups(json, nodes);
        // generateShortestPaths(nodes);

        return createPassiveTree(json, groups);
    }
};
