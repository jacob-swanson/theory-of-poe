import {PassiveSkillTreeOptionsJson} from "../../../gamedata/passive-skill-tree/external-data/PassiveSkillTreeOptionsJson";
import {CharacterClass, NodeState, NodeType} from "./NodeState";
import {PassiveTreeState} from "./PassiveTreeState";
import {GroupState, GroupStateBackground} from "./GroupState";
import {Dictionary} from "../../../utils/Dictionary";
import {NodeJson} from "../../../gamedata/passive-skill-tree/external-data/NodeJson";

/**
 * Create groups and populate with nodes.
 *
 * @param json
 */
function createGroups(json: PassiveSkillTreeOptionsJson): Map<string, GroupState> {
    const groups = new Map<string, GroupState>();
    for (const [groupId, groupJson] of Object.entries(json.passiveSkillTreeData.groups)) {
        const group = new GroupState(
            groupId,
            {x: groupJson.x * 0.3835, y: groupJson.y * 0.3835},
            getGroupBackground(groupJson.oo)
        );
        groups.set(groupId, group);
    }
    return groups;
}

/**
 * Connect all of the mutable references together.
 *
 * @param json
 * @param groups
 * @param nodes
 * @param passiveTree
 */
function connectReferences(
    json: PassiveSkillTreeOptionsJson,
    groups: Map<string, GroupState>,
    nodes: Map<string, NodeState>,
    passiveTree: PassiveTreeState
) {
    for (const node of nodes.values()) {
        const nodeJson = json.passiveSkillTreeData.nodes[node.id]!!;
        const groupId = nodeJson.g;
        const group = groups.get(groupId.toString())!!;

        node.group = group;
        group.nodes.push(node);

        for (const toNodeId of nodeJson.out) {
            const toNode = nodes.get(toNodeId.toString())!!;
            node.connections.add(toNode);
            toNode.connections.add(node);
        }
    }

    for (const group of groups.values()) {
        group.passiveTree = passiveTree;
    }
    passiveTree.groups = groups;
}

/**
 * Get a group's background type.
 *
 * @param oo
 */
function getGroupBackground(oo: Dictionary<boolean>): GroupStateBackground {
    if (oo[3]) {
        return GroupStateBackground.Large;
    } else if (oo[2]) {
        return GroupStateBackground.Medium;
    } else if (oo[1]) {
        return GroupStateBackground.Small;
    }
    return GroupStateBackground.None;
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
 * @param nodeJson
 */
function getClassStart(nodeJson: NodeJson): CharacterClass | null {
    if (nodeJson.spc.length !== 1) {
        return null;
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

    return spcToClass[nodeJson.spc[0]];
}

/**
 * Create nodes and connect them together.
 *
 * @param json
 */
function createNodes(json: PassiveSkillTreeOptionsJson): Map<string, NodeState> {
    const nodes = new Map<string, NodeState>();
    for (const [nodeId, nodeJson] of Object.entries(json.passiveSkillTreeData.nodes)) {
        nodes.set(
            nodeId,
            new NodeState(
                nodeId,
                nodeJson.dn,
                nodeJson.o,
                nodeJson.oidx,
                nodeJson.icon,
                getNodeType(nodeJson),
                nodeJson.ascendancyName,
                getClassStart(nodeJson)
            )
        );
    }
    return nodes;
}

/**
 * Create the root passive tree.
 *
 * @param json
 */
function createPassiveTree(json: PassiveSkillTreeOptionsJson): PassiveTreeState {
    return new PassiveTreeState(
        json.passiveSkillTreeData.constants.orbitRadii.map(r => r * 0.3835),
        json.passiveSkillTreeData.constants.skillsPerOrbit,
        json.passiveSkillTreeData.skillSprites
    );
}

export const PassiveSkillTreeStateFactory = {
    /**
     * Convert GGG's passive tree data to ours.
     *
     * @param json
     */
    create: (json: PassiveSkillTreeOptionsJson): PassiveTreeState => {
        const groups = createGroups(json);
        const nodes = createNodes(json);
        const passiveTree = createPassiveTree(json);

        connectReferences(json, groups, nodes, passiveTree);

        return passiveTree;
    }
};
