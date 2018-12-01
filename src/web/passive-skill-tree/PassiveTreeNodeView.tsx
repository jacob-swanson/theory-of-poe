import * as React from "react";
import {SkillSpriteGroups} from "../../gamedata/passive-skill-tree/external-data/SkillSpritesJson";
import {ConsoleLogger} from "../../utils/logger/ConsoleLogger";
import {Node, NodeAllocationState, NodeType} from "../../gamedata/Node";
import {CharacterClass} from "../../gamedata/Character";
import * as PIXI from "pixi.js";
import {CenterAnchor} from "../mobx-pixi/CenterAnchor";
import {autorun, IReactionDisposer} from "mobx";
import {bind} from "../../utils/bind";

const log = new ConsoleLogger("debug");

const AssetNameByTypeByState = {
    [NodeAllocationState.Allocated]: {
        [NodeType.Normal]: "PSSkillFrameActive",
        [NodeType.Keystone]: "KeystoneFrameAllocated",
        [NodeType.Notable]: "NotableFrameAllocated",
        [NodeType.AscendancySmall]: "PassiveSkillScreenAscendancyFrameSmallAllocated",
        [NodeType.AscendancyLarge]: "PassiveSkillScreenAscendancyFrameLargeAllocated",
        [NodeType.JewelSocket]: "JewelFrameAllocatedg",
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

const AssetNameByCharacterClass = {
    [CharacterClass.Witch]: "centerwitch",
    [CharacterClass.Shadow]: "centershadow",
    [CharacterClass.Ranger]: "centerranger",
    [CharacterClass.Duelist]: "centerduelist",
    [CharacterClass.Marauder]: "centermarauder",
    [CharacterClass.Templar]: "centertemplar",
    [CharacterClass.Scion]: "centerscion"
};

const AssetNameByState = {
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


export class PassiveTreeNodeView extends PIXI.Container {
    private readonly allocatedFrame?: PIXI.Sprite;
    private readonly unallocatedFrame?: PIXI.Sprite;
    private readonly allocatedIcon?: PIXI.Sprite;
    private readonly unallocatedIcon?: PIXI.Sprite;
    private readonly dispose: IReactionDisposer;

    constructor(private readonly node: Node) {
        super();
        this.node = node;

        this.on("pointerdown", this.onClick);

        this.x = node.position.x;
        this.y = node.position.y;

        this.allocatedIcon = PassiveTreeNodeView.loadIcon(node, NodeAllocationState.Allocated);
        if (this.allocatedIcon) {
            this.addChild(this.allocatedIcon);
        }
        this.unallocatedIcon = PassiveTreeNodeView.loadIcon(node, NodeAllocationState.Unallocated);
        if (this.unallocatedIcon) {
            this.addChild(this.unallocatedIcon);
        }

        this.allocatedFrame = PassiveTreeNodeView.loadFrame(node, NodeAllocationState.Allocated);
        if (this.allocatedFrame) {
            this.addChild(this.allocatedFrame);
        }
        this.unallocatedFrame = PassiveTreeNodeView.loadFrame(node, NodeAllocationState.Unallocated);
        if (this.unallocatedFrame) {
            this.addChild(this.unallocatedFrame);
        }

        this.dispose = autorun(this.update);
    }

    private static loadFrame(node: Node, state: NodeAllocationState): PIXI.Sprite | undefined {
        const resourceName = node.className && state === NodeAllocationState.Allocated ?
            AssetNameByCharacterClass[node.className] :
            AssetNameByTypeByState[state][node.type];
        const resource = PIXI.loader.resources[resourceName];
        if (!resource) {
            return;
        }
        const sprite = new PIXI.Sprite(resource.texture);
        sprite.anchor = CenterAnchor;
        return sprite;
    }

    private static loadIcon(node: Node, state: NodeAllocationState): PIXI.Sprite | undefined {
        if (!node.iconPath) {
            return;
        }

        const resourceName = AssetNameByState[state][node.type];
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
        sprite.anchor = CenterAnchor;
        return sprite;
    }

    public destroy(options?: PIXI.DestroyOptions | boolean): void {
        super.destroy(options);
        this.dispose();
    }

    @bind
    private update() {
        this.interactive = this.node.isAllocatable;
        this.buttonMode = this.node.isAllocatable;

        if (this.allocatedFrame) {
            this.allocatedFrame.visible = this.node.isAllocated;
        }
        if (this.unallocatedFrame) {
            this.unallocatedFrame.visible = !this.node.isAllocated;
        }

        if (this.allocatedIcon) {
            this.allocatedIcon.visible = this.node.isAllocated;
        }
        if (this.unallocatedIcon) {
            this.unallocatedIcon.visible = !this.node.isAllocated;
        }
    }

    @bind
    private onClick() {
        if (this.node.isAllocatable) {
            this.node.toggleAllocation();
        }
    };
}