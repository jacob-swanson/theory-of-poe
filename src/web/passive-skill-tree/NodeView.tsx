import * as React from "react";
import {SkillSpriteGroups} from "../../gamedata/passive-skill-tree/external-data/SkillSpritesJson";
import {Node, NodeAllocationState, NodeType} from "../../gamedata/Node";
import {CharacterClass} from "../../gamedata/Character";
import * as PIXI from "pixi.js";
import {autorun, IReactionDisposer} from "mobx";
import {bind} from "../../utils/bind";
import {ConsoleLogger} from "../../utils/logger/ConsoleLogger";
import InteractionEvent = PIXI.interaction.InteractionEvent;

const log = new ConsoleLogger("NodeView", "debug");

const FrameAssetNameByTypeByState = {
    [NodeAllocationState.Allocated]: {
        [NodeType.Normal]: "PSSkillFrameActive",
        [NodeType.Keystone]: "KeystoneFrameAllocated",
        [NodeType.Notable]: "NotableFrameAllocated",
        [NodeType.AscendancySmall]: "PassiveSkillScreenAscendancyFrameSmallAllocated",
        [NodeType.AscendancyLarge]: "PassiveSkillScreenAscendancyFrameLargeAllocated",
        [NodeType.JewelSocket]: "JewelFrameAllocated",
        [NodeType.AscendancyStart]: "PassiveSkillScreenAscendancyMiddle",
        [NodeType.ClassStart]: "PSStartNodeBackgroundInactive"
    },
    [NodeAllocationState.CanAllocate]: {
        [NodeType.Normal]: "PSSkillFrameHighlighted",
        [NodeType.Keystone]: "KeystoneFrameCanAllocate",
        [NodeType.Notable]: "NotableFrameCanAllocate",
        [NodeType.AscendancySmall]: "PassiveSkillScreenAscendancyFrameSmallCanAllocate",
        [NodeType.AscendancyLarge]: "PassiveSkillScreenAscendancyFrameLargeCanAllocate",
        [NodeType.JewelSocket]: "JewelFrameCanAllocate",
        [NodeType.AscendancyStart]: "PassiveSkillScreenAscendancyMiddle",
        [NodeType.ClassStart]: "PSStartNodeBackgroundInactive"
    },
    [NodeAllocationState.Unallocated]: {
        [NodeType.Normal]: "PSSkillFrame",
        [NodeType.Keystone]: "KeystoneFrameUnallocated",
        [NodeType.Notable]: "NotableFrameUnallocated",
        [NodeType.AscendancySmall]: "PassiveSkillScreenAscendancyFrameSmallNormal",
        [NodeType.AscendancyLarge]: "PassiveSkillScreenAscendancyFrameLargeNormal",
        [NodeType.JewelSocket]: "JewelFrameUnallocated",
        [NodeType.AscendancyStart]: "PassiveSkillScreenAscendancyMiddle",
        [NodeType.ClassStart]: "PSStartNodeBackgroundInactive"
    }
};

const ClassStartFrameAssetNameByCharacterClass = {
    [CharacterClass.Witch]: "centerwitch",
    [CharacterClass.Shadow]: "centershadow",
    [CharacterClass.Ranger]: "centerranger",
    [CharacterClass.Duelist]: "centerduelist",
    [CharacterClass.Marauder]: "centermarauder",
    [CharacterClass.Templar]: "centertemplar",
    [CharacterClass.Scion]: "centerscion"
};

const SpriteSheetNameByState = {
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

export class NodeView extends PIXI.Container {
    private readonly allocatedFrame?: PIXI.Sprite;
    private readonly unallocatedFrame?: PIXI.Sprite;
    private readonly allocatedIcon?: PIXI.Sprite;
    private readonly unallocatedIcon?: PIXI.Sprite;
    private readonly dispose: IReactionDisposer;

    constructor(private readonly node: Node) {
        super();
        this.node = node;

        this.on("pointerup", this.onClick);
        if (node.name) {
            this.on("pointerover", this.onHoverEnter);
            this.on("pointerout", this.onHoverLeave);
        }

        this.x = node.position.x;
        this.y = node.position.y;

        this.allocatedIcon = NodeView.loadIcon(node, NodeAllocationState.Allocated);
        if (this.allocatedIcon) {
            this.addChild(this.allocatedIcon);
        }
        this.unallocatedIcon = NodeView.loadIcon(node, NodeAllocationState.Unallocated);
        if (this.unallocatedIcon) {
            this.addChild(this.unallocatedIcon);
        }

        this.allocatedFrame = NodeView.loadFrame(node, NodeAllocationState.Allocated);
        if (this.allocatedFrame) {
            this.addChild(this.allocatedFrame);
        }
        this.unallocatedFrame = NodeView.loadFrame(node, NodeAllocationState.Unallocated);
        if (this.unallocatedFrame) {
            this.addChild(this.unallocatedFrame);
        }

        this.dispose = autorun(this.update);
    }

    private static loadFrame(node: Node, state: NodeAllocationState): PIXI.Sprite | undefined {
        const resourceName = node.className && state === NodeAllocationState.Allocated ?
            ClassStartFrameAssetNameByCharacterClass[node.className] :
            FrameAssetNameByTypeByState[state][node.type];
        const resource = PIXI.loader.resources[resourceName];
        if (!resource) {
            return;
        }
        const sprite = new PIXI.Sprite(resource.texture);
        sprite.anchor.x = 0.5;
        sprite.anchor.y = 0.5;
        return sprite;
    }

    private static loadIcon(node: Node, state: NodeAllocationState): PIXI.Sprite | undefined {
        if (!node.iconPath) {
            return;
        }

        const resourceName = SpriteSheetNameByState[state][node.type];
        const resource = PIXI.loader.resources[resourceName];
        if (!resource) {
            return;
        }

        const spritesheet = resource.spritesheet;
        if (!spritesheet) {
            return;
        }

        const texture = spritesheet.textures[node.iconPath];
        if (!texture) {
            return;
        }
        const sprite = new PIXI.Sprite(texture);
        sprite.anchor.x = 0.5;
        sprite.anchor.y = 0.5;
        return sprite;
    }

    public destroy(options?: PIXI.DestroyOptions | boolean): void {
        super.destroy(options);
        this.dispose();
    }

    @bind
    private onHoverEnter(e: InteractionEvent) {
        log.trace("NodeView.onHoverEnter", {event: e, node: this});

        if (this.node.group.passiveTree.tooltip.node && this.node.group.passiveTree.tooltip.node !== this.node) {
            this.node.group.passiveTree.tooltip.node.hoverExit();
        }
        this.showTooltip();
        this.node.hoverEnter();
    }

    private showTooltip() {
        this.node.group.passiveTree.tooltip.node = this.node;
        const worldPosition = this.getGlobalPosition(undefined, true);
        const bounds = this.getBounds(true);
        this.node.group.passiveTree.tooltip.worldPosition.x = worldPosition.x + bounds.width / 2;
        this.node.group.passiveTree.tooltip.worldPosition.y = worldPosition.y - bounds.height / 2;

    }

    @bind
    private onHoverLeave(e: InteractionEvent) {
        log.trace("NodeView.onHoverLeave", {event: e, node: this});

        // Hide tooltip
        if (this.node.group.passiveTree.tooltip.node === this.node) {
            this.node.group.passiveTree.tooltip.node = undefined;
            this.node.hoverExit();
        }
    }


    @bind
    private update() {
        this.interactive = this.node.isAllocatable;
        this.buttonMode = this.node.isAllocatable;

        const showAllocatedFrame = !this.node.isPendingRemoval && (this.node.isAllocated || this.node.isHighlighted);
        if (this.allocatedFrame) {
            this.allocatedFrame.visible = showAllocatedFrame;
        }
        if (this.unallocatedFrame) {
            this.unallocatedFrame.visible = !showAllocatedFrame;
        }

        if (this.allocatedIcon) {
            this.allocatedIcon.visible = this.node.isAllocated;
        }
        if (this.unallocatedIcon) {
            this.unallocatedIcon.visible = !this.node.isAllocated;
        }
    }

    @bind
    private onClick(e: InteractionEvent) {
        log.trace("NodeView.onClick", {event: e, node: this});

        if (!this.node.group.passiveTree.isDragging && this.node.isAllocatable) {
            this.node.toggleAllocation();
        }
    };
}