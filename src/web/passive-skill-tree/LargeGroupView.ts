import {Group, GroupBackgroundType} from "../../gamedata/Group";
import * as PIXI from "pixi.js";

export class LargeGroupView extends PIXI.Container {
    constructor(private readonly group: Group) {
        super();

        this.x = group.position.x;
        this.y = group.position.y;

        if (group.backgroundType !== GroupBackgroundType.Large) {
            throw new Error("Group was not a Large group");
        }

        const topSprite = new PIXI.Sprite(PIXI.loader.resources.PSGroupBackground3.texture);
        topSprite.anchor.x = 0.5;
        topSprite.anchor.y = 1;
        this.addChild(topSprite);

        const bottomSprite = new PIXI.Sprite(PIXI.loader.resources.PSGroupBackground3.texture);
        bottomSprite.scale.y = -1;
        bottomSprite.anchor.x = 0.5;
        bottomSprite.anchor.y = 1;
        this.addChild(bottomSprite);
    }
}