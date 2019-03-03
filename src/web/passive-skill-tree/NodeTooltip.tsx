import * as React from "react";
import {Character} from "../../gamedata/Character";
import {autorun, IReactionDisposer} from "mobx";
import * as PIXI from "pixi.js";
import {bind} from "../../utils/bind";
import {PassiveTreeTooltip} from "../../gamedata/PassiveTree";
import {LoggerFactory} from "../../utils/logger/LoggerFactory";
import {InteractiveStage} from "../pixi/InteractiveStage";

const log = LoggerFactory.getLogger("NodeTooltip");

export class NodeTooltip extends PIXI.Container {
    private readonly text = new PIXI.Text();
    private readonly interactiveStage: InteractiveStage;
    private readonly dispose: IReactionDisposer;

    constructor(private readonly character: Character) {
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
            this.position.x = node.position.x * this.interactiveStage.worldScale.x + this.interactiveStage.worldPosition.x;
            this.position.y = node.position.y * this.interactiveStage.worldScale.y + this.interactiveStage.worldPosition.y;
            this.text.text = node.name;
        }
    }
}