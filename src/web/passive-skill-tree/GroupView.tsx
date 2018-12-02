import * as React from "react";
import {ConsoleLogger} from "../../utils/logger/ConsoleLogger";
import {Group, GroupBackgroundType} from "../../gamedata/Group";
import * as PIXI from "pixi.js";

const log = new ConsoleLogger("Group", "debug");

const GroupBackgroundByType = {
    [GroupBackgroundType.Medium]: "PSGroupBackground2",
    [GroupBackgroundType.Small]: "PSGroupBackground1"
};

export class GroupView extends PIXI.Container {
    constructor(private readonly group: Group) {
        super();

        this.x = group.position.x;
        this.y = group.position.y;

        const resource = PIXI.loader.resources[GroupBackgroundByType[group.backgroundType]];
        if (!resource) {
            log.warn(`Resource not found for group type ${group.backgroundType}`);
        }
        const sprite = new PIXI.Sprite(resource.texture);
        sprite.anchor.x = 0.5;
        sprite.anchor.y = 0.5;
        this.addChild(sprite);
    }
}