import * as React from "react";
import {Character} from "../../gamedata/Character";
import * as PIXI from "pixi.js";
import {PassiveTreeTooltip} from "../../gamedata/PassiveTree";
import {Node, NodeType} from "../../gamedata/Node";
import {LoggerFactory} from "../../utils/logger/LoggerFactory";
import {InteractiveSceneState} from "../stores/InteractiveStageState";
import {pixiObserver} from "../pixi/pixiObserver";

const log = LoggerFactory.getLogger("NodeTooltip");

export class NodeTooltip extends pixiObserver(PIXI.Container) {
    private paddingSize = 5;
    private readonly textContainer = new PIXI.Container();
    private readonly background = new PIXI.Graphics();

    private readonly titleText = NodeTooltip.createTitle();
    private readonly descriptionText = NodeTooltip.createDescription();

    constructor(private readonly character: Character, private readonly interactiveSceneState: InteractiveSceneState) {
        super();
        this.visible = false;

        this.addChild(this.background);
        this.descriptionText.position.y = 20;
        this.textContainer.addChild(this.titleText, this.descriptionText);
        this.textContainer.position.x = this.paddingSize;
        this.textContainer.position.y = this.paddingSize;
        this.addChild(this.textContainer);
    }

    public static createTitle(): PIXI.Text {
        const style = new PIXI.TextStyle({
            fontSize: 16,
            fontWeight: "bold",
            fill: "white"
        });
        return new PIXI.Text("TITLE", style);
    }

    public static createDescription(): PIXI.Text {
        const style = new PIXI.TextStyle({
            fontSize: 12,
            fill: "white"
        });
        return new PIXI.Text("DESCRIPTION", style);
    }

    public react(): void {
        const tooltip: PassiveTreeTooltip = this.character.passiveTree.tooltip;
        const node = this.character.passiveTree.tooltip.node;
        if (!node) {
            this.visible = false;
        } else {
            this.visible = true;

            const scale = {x: this.interactiveSceneState.worldScale.x, y: this.interactiveSceneState.worldScale.y};
            // floor snaps to pixel to prevent blur
            this.position.x = Math.floor((node.position.x + node.radius + 5) * scale.x + this.interactiveSceneState.worldPosition.x);
            this.position.y = Math.floor((node.position.y - node.radius) * scale.y + this.interactiveSceneState.worldPosition.y);

            this.titleText.text = node.name;

            // jewel sockets do not have mods
            if (node.mods.length === 0) {
                this.descriptionText.visible = false;
            } else {
                this.descriptionText.visible = true;
                this.descriptionText.text = node.mods.map(mod => mod.getDescription()).join("\n");
            }

            this.background.clear();
            this.background.lineStyle(2, 0xFFFFFF, 0.5);
            this.background.beginFill(0x00000, 0.25);
            this.background.drawRect(0, 0, this.textContainer.width + this.paddingSize * 2, this.textContainer.height + this.paddingSize * 2);
            this.background.endFill();
        }
    }
}