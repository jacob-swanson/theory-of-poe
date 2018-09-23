import * as React from "react";
import {Component} from "react";
import {CharacterClass, NodeAllocationState, NodeState, NodeType} from "../stores/passive-skill-tree/NodeState";
import {SkillSpriteGroups} from "../../gamedata/passive-skill-tree/external-data/SkillSpritesJson";
import {observer} from "mobx-react";
import {ConsoleLogger} from "../../utils/logger/ConsoleLogger";

const log = new ConsoleLogger("debug");

const frameByTypeByState = {
    [NodeAllocationState.Allocated]: {
        [NodeType.Normal]: "gamedata/3.3.1/assets/PSSkillFrameActive-0.3835.png",
        [NodeType.Keystone]: "gamedata/3.3.1/assets/KeystoneFrameAllocated-0.3835.png",
        [NodeType.Notable]: "gamedata/3.3.1/assets/NotableFrameAllocated-0.3835.png",
        [NodeType.AscendancySmall]: "gamedata/3.3.1/assets/PassiveSkillScreenAscendancyFrameSmallAllocated-0.3835.png",
        [NodeType.AscendancyLarge]: "gamedata/3.3.1/assets/PassiveSkillScreenAscendancyFrameLargeAllocated-0.3835.png",
        [NodeType.JewelSocket]: "gamedata/3.3.1/assets/JewelFrameAllocated-0.3835.png",
        [NodeType.AscendancyStart]: "gamedata/3.3.1/assets/PassiveSkillScreenAscendancyMiddle-0.3835.png"
    },
    [NodeAllocationState.CanAllocate]: {
        [NodeType.Normal]: "gamedata/3.3.1/assets/PSSkillFrameHighlighted-0.3835.png",
        [NodeType.Keystone]: "gamedata/3.3.1/assets/KeystoneFrameCanAllocate-0.3835.png",
        [NodeType.Notable]: "gamedata/3.3.1/assets/NotableFrameCanAllocate-0.3835.png",
        [NodeType.AscendancySmall]: "gamedata/3.3.1/assets/PassiveSkillScreenAscendancyFrameSmallCanAllocate-0.3835.png",
        [NodeType.AscendancyLarge]: "gamedata/3.3.1/assets/PassiveSkillScreenAscendancyFrameLargeCanAllocate-0.3835.png",
        [NodeType.JewelSocket]: "gamedata/3.3.1/assets/JewelFrameCanAllocate-0.3835.png",
        [NodeType.AscendancyStart]: "gamedata/3.3.1/assets/PassiveSkillScreenAscendancyMiddle-0.3835.png"
    },
    [NodeAllocationState.Unallocated]: {
        [NodeType.Normal]: "gamedata/3.3.1/assets/PSSkillFrame-0.3835.png",
        [NodeType.Keystone]: "gamedata/3.3.1/assets/KeystoneFrameUnallocated-0.3835.png",
        [NodeType.Notable]: "gamedata/3.3.1/assets/NotableFrameUnallocated-0.3835.png",
        [NodeType.AscendancySmall]: "gamedata/3.3.1/assets/PassiveSkillScreenAscendancyFrameSmallNormal-0.3835.png",
        [NodeType.AscendancyLarge]: "gamedata/3.3.1/assets/PassiveSkillScreenAscendancyFrameLargeNormal-0.3835.png",
        [NodeType.JewelSocket]: "gamedata/3.3.1/assets/JewelFrameUnallocated-0.3835.png",
        [NodeType.AscendancyStart]: "gamedata/3.3.1/assets/PassiveSkillScreenAscendancyMiddle-0.3835.png"
    }
};

const classStartIconByCharacterClass = {
    [CharacterClass.Witch]: "gamedata/3.3.1/assets/centerwitch-0.3835.png",
    [CharacterClass.Shadow]: "gamedata/3.3.1/assets/centershadow-0.3835.png",
    [CharacterClass.Ranger]: "gamedata/3.3.1/assets/centerranger-0.3835.png",
    [CharacterClass.Duelist]: "gamedata/3.3.1/assets/centerduelist-0.3835.png",
    [CharacterClass.Marauder]: "gamedata/3.3.1/assets/centermarauder-0.3835.png",
    [CharacterClass.Templar]: "gamedata/3.3.1/assets/centertemplar-0.3835.png",
    [CharacterClass.Scion]: "gamedata/3.3.1/assets/centerscion-0.3835.png"
};

/**
 * Get the URL for a node's frame sprite.
 *
 * @param node
 */
function getFrameUrl(node: NodeState): string | null {
    if (node.isClassStart && node.className !== null) {
        return node.isAllocated ? classStartIconByCharacterClass[node.className] : "gamedata/3.3.1/assets/PSStartNodeBackgroundInactive-0.3835.gif";
    }

    const state = node.isAllocated ? NodeAllocationState.Allocated : NodeAllocationState.Unallocated;
    return frameByTypeByState[state][node.type] || null;
}

/**
 * Render the frame.
 *
 * @param node
 */
function renderFrame(node: NodeState) {
    const url = getFrameUrl(node);
    if (url === null) {
        return null;
    }

    return (
        <pixi-sprite
            anchor={{x: 0.5, y: 0.5}}
            url={url}
        />
    );
}

const iconByTypeByState = {
    [NodeAllocationState.Allocated]: {
        [NodeType.Normal]: SkillSpriteGroups.normalActive,
        [NodeType.Keystone]: SkillSpriteGroups.keystoneActive,
        [NodeType.Notable]: SkillSpriteGroups.notableActive,
        [NodeType.Mastery]: SkillSpriteGroups.mastery,
        [NodeType.AscendancySmall]: SkillSpriteGroups.normalActive,
        [NodeType.AscendancyLarge]: SkillSpriteGroups.notableActive
    },
    [NodeAllocationState.Unallocated]: {
        [NodeType.Normal]: SkillSpriteGroups.normalInactive,
        [NodeType.Keystone]: SkillSpriteGroups.keystoneInactive,
        [NodeType.Notable]: SkillSpriteGroups.notableInactive,
        [NodeType.Mastery]: SkillSpriteGroups.mastery,
        [NodeType.AscendancySmall]: SkillSpriteGroups.normalInactive,
        [NodeType.AscendancyLarge]: SkillSpriteGroups.notableInactive
    }
};

/**
 * Get the node's icon group.
 *
 * @param node
 */
function getIconGroup(node: NodeState): SkillSpriteGroups {
    const state = node.isAllocated ? NodeAllocationState.Allocated : NodeAllocationState.Unallocated;
    return iconByTypeByState[state][node.type];
}

/**
 * Get the sprite sheet URL and frame for the icon.
 *
 * @param node
 */
function findIcon(node: NodeState) {
    if (node.type === NodeType.AscendancyStart || node.type === NodeType.ClassStart) {
        return {};
    }

    const path = node.icon;
    const iconGroup = getIconGroup(node);
    if (!iconGroup) {
        return {};
    }
    const spriteSheets = node.group.passiveTree.skillSprites[iconGroup];
    if (!spriteSheets) {
        throw new Error(`Sprite sheet ${iconGroup} not found`);
    }
    const spriteSheet = spriteSheets[spriteSheets.length - 1];
    if (spriteSheet.coords[path]) {
        const frame = spriteSheet.coords[path];
        const url = "gamedata/3.3.1/" + spriteSheet.filename;

        return {
            frame: {x: frame.x, y: frame.y, width: frame.w, height: frame.h},
            url
        };
    }

    throw new Error(`Could not find icon for ${node}`);
}

/**
 * Render the icon.
 *
 * @param node
 */
function renderIcon(node: NodeState) {
    const icon = findIcon(node);
    return (
        <pixi-sprite
            anchor={{x: 0.5, y: 0.5}}
            url={icon.url}
            frame={icon.frame}
        />
    );
}

export interface NodeComponentProps {
    node: NodeState
}

@observer
export class NodeComponent extends Component<NodeComponentProps> {
    public render() {
        const {node} = this.props;

        log.trace(`Rendering node ${node.id}`);

        const onClick = node.isAllocatable ? node.toggleAllocated : undefined;
        return (
            <pixi-container position={node.position} onClick={onClick}>
                {renderIcon(node)}
                {renderFrame(node)}
            </pixi-container>
        );
    }
}