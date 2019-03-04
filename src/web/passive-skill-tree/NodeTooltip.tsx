import * as React from "react";
import {Character} from "../../gamedata/Character";
import {autorun, IReactionDisposer} from "mobx";
import * as PIXI from "pixi.js";
import {bind} from "../../utils/bind";
import {PassiveTreeTooltip} from "../../gamedata/PassiveTree";
import {LoggerFactory} from "../../utils/logger/LoggerFactory";
import {InteractiveSceneState} from "../stores/InteractiveStageState";

const log = LoggerFactory.getLogger("NodeTooltip");

export class NodeTooltip extends PIXI.Container {
    private readonly text = new PIXI.Text();
    private readonly dispose: IReactionDisposer;

    constructor(private readonly character: Character, private readonly interactiveSceneState: InteractiveSceneState) {
        super();
        this.addChild(this.text);
        this.dispose = autorun(this.update);
    }

    public destroy(options?: PIXI.DestroyOptions | boolean): void {
        super.destroy(options);
        this.dispose();
    }


    @bind
    private update(): void {
        const tooltip: PassiveTreeTooltip = this.character.passiveTree.tooltip;
        const node = this.character.passiveTree.tooltip.node;
        if (!node) {
            this.text.visible = false;
        } else {
            this.text.visible = true;
            this.position.x = node.position.x * this.interactiveSceneState.worldScale.x + this.interactiveSceneState.worldPosition.x;
            this.position.y = node.position.y * this.interactiveSceneState.worldScale.y + this.interactiveSceneState.worldPosition.y;
            this.text.text = node.name;
        }
    }
}