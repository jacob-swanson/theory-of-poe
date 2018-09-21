import * as React from "react";
import {StatelessComponent} from "react";
import {NodeAllocationState, NodeState, NodeType} from "../../stores/passive-skill-tree/NodeState";
import {SkillSpriteGroups} from "../../../gamedata/passive-skill-tree/external-data/SkillSpritesJson";

const frameByTypeByState = {
    [NodeAllocationState.Allocated]: {
        [NodeType.Normal]: "gamedata/3.3.1/assets/PSSkillFrameActive-0.3835.png",
        [NodeType.Keystone]: "gamedata/3.3.1/assets/KeystoneFrameAllocated-0.3835.png",
        [NodeType.Notable]: "gamedata/3.3.1/assets/NotableFrameAllocated-0.3835.png"
    },
    [NodeAllocationState.CanAllocate]: {
        [NodeType.Normal]: "gamedata/3.3.1/assets/PSSkillFrameHighlighted-0.3835.png",
        [NodeType.Keystone]: "gamedata/3.3.1/assets/KeystoneFrameCanAllocate-0.3835.png",
        [NodeType.Notable]: "gamedata/3.3.1/assets/NotableFrameCanAllocate-0.3835.png"
    },
    [NodeAllocationState.Unallocated]: {
        [NodeType.Normal]: "gamedata/3.3.1/assets/PSSkillFrame-0.3835.png",
        [NodeType.Keystone]: "gamedata/3.3.1/assets/KeystoneFrameUnallocated-0.3835.png",
        [NodeType.Notable]: "gamedata/3.3.1/assets/NotableFrameUnallocated-0.3835.png"
    }
};

/**
 * Get the URL for a node's frame sprite.
 *
 * @param node
 */
function getFrameUrl(node: NodeState): string | null {
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
        [NodeType.Normal]: "normalInactive",
        [NodeType.Keystone]: "keystoneActive",
        [NodeType.Notable]: "notableActive"
    },
    [NodeAllocationState.Unallocated]: {
        [NodeType.Normal]: "normalInactive",
        [NodeType.Keystone]: "keystoneInactive",
        [NodeType.Notable]: "notableInactive",
        [NodeType.Mastery]: "mastery"
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
    const path = node.icon;
    const iconGroup = getIconGroup(node);
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

export const NodeComponent: StatelessComponent<NodeComponentProps> = ({node}) => {
    return (
        <pixi-container position={node.position}>
            {renderIcon(node)}
            {renderFrame(node)}
        </pixi-container>
    );
};