import {inject, observer} from "mobx-react";
import {Character} from "../../gamedata/Character";
import {NodeView} from "./NodeView";
import {InteractiveStage} from "../pixi/InteractiveStage";
import * as React from "react";
import {Component} from "react";
import {GroupView} from "./GroupView";
import {observable} from "mobx";
import {bind} from "../../utils/bind";
import {GroupBackgroundType} from "../../gamedata/Group";
import {AscendancyGroupView} from "./AscendancyGroupView";
import {LargeGroupView} from "./LargeGroupView";
import {LinkView} from "./LinkView";
import "./PassiveTreeView.css";
import {StageRect} from "../pixi/Stage";
import {Scene} from "../pixi/Scene";
import {NodeTooltip} from "./NodeTooltip";

export interface PassiveSkillTreeProps {
    character?: Character
}

@inject("character")
@observer
export class PassiveTreeView extends Component<PassiveSkillTreeProps> {
    private static areAssetsLoaded = false;
    @observable
    private isReady: boolean = false;
    private worldScene: Scene = new Scene("PassiveTreeViewWorld");
    private uiScene = new Scene("PassiveTreeViewUi");

    public componentDidMount(): void {
        const {character} = this.props;
        if (!character) {
            throw new Error("character was undefined");
        }

        if (!PassiveTreeView.areAssetsLoaded) {
            this.loadAssets();
            PassiveTreeView.areAssetsLoaded = true;
        } else {
            this.createChildren();
        }
    }

    public render(): any {
        if (this.isReady) {
            return (
                <InteractiveStage
                    className="PassiveTreeView"
                    autoStart={true}
                    minScale={0.1}
                    maxScale={2}
                    onDragStart={this.onCanvasDragStart}
                    onDragMove={this.onCanvasDragMove}
                    onDragEnd={this.onCanvasDragEnd}
                    onResize={this.onCanvasResize}
                    onWheel={this.onCanvasWheel}
                    worldScene={this.worldScene}
                    uiScene={this.uiScene}
                />
            );
        } else {
            return "Loading...";
        }
    }

    private loadAssets() {
        const {character} = this.props;
        if (!character) {
            throw new Error("character was undefined");
        }

        const loader = PIXI.loader;
        for (const [name, url] of Object.entries(character.passiveTree.assets)) {
            loader.add(name, url);
        }
        for (const [name, url] of Object.entries(character.passiveTree.skillSprites)) {
            loader.add(name, url);
        }
        for (const [name, classArt] of Object.entries(character.passiveTree.classArt)) {
            loader.add(classArt.url);
        }
        loader.load(this.createChildren);
    }

    @bind
    private onCanvasDragStart() {
        const {character} = this.props;
        if (!character) {
            throw new Error("character was undefined");
        }
        character.passiveTree.isDragging = true;
    }

    @bind
    private onCanvasDragMove() {
        const {character} = this.props;
        if (!character) {
            throw new Error("character was undefined");
        }

        character.passiveTree.tooltip.worldPosition.x = this.worldScene.position.x;
        character.passiveTree.tooltip.worldPosition.y = this.worldScene.position.y;
        character.passiveTree.tooltip.scale.x = this.worldScene.scale.x;
        character.passiveTree.tooltip.scale.y = this.worldScene.scale.y;
    }

    @bind
    private onCanvasDragEnd() {
        const {character} = this.props;
        if (!character) {
            throw new Error("character was undefined");
        }
        character.passiveTree.isDragging = false;
    }

    @bind
    private onCanvasResize(rect: StageRect) {
        const {character} = this.props;
        if (!character) {
            throw new Error("character was undefined");
        }
    }

    @bind
    private onCanvasWheel() {
        const {character} = this.props;
        if (!character) {
            throw new Error("character was undefined");
        }
        character.passiveTree.tooltip.worldPosition.x = this.worldScene.position.x;
        character.passiveTree.tooltip.worldPosition.y = this.worldScene.position.y;
        character.passiveTree.tooltip.scale.x = this.worldScene.scale.x;
        character.passiveTree.tooltip.scale.y = this.worldScene.scale.y;
    }

    private createGroups(): PIXI.DisplayObject[] {
        if (!this.props.character) {
            throw new Error("character is required");
        }

        const groups = [];
        for (const group of this.props.character.passiveTree.groups.values()) {
            switch (group.backgroundType) {
                case GroupBackgroundType.Small:
                    groups.push(new GroupView(group));
                    break;
                case GroupBackgroundType.Medium:
                    groups.push(new GroupView(group));
                    break;
                case GroupBackgroundType.Large:
                    groups.push(new LargeGroupView(group));
                    break;
                case GroupBackgroundType.Ascendancy:
                    groups.push(new AscendancyGroupView(group));
                    break;
            }
        }
        return groups;
    }

    @bind
    private createChildren(): void {
        const {character} = this.props;
        if (character === undefined) {
            throw new Error("character was undefined");
        }

        const background = new PIXI.extras.TilingSprite(
            PIXI.Texture.fromImage("gamedata/3.3.1/assets/Background1-0.3835.png"),
            1000000,
            1000000
        );
        background.x = -500000;
        background.y = -500000;

        const groupsLayer = new PIXI.Container();
        groupsLayer.addChild(...this.createGroups());

        const linksLayer = new PIXI.Container();
        linksLayer.addChild(...character.passiveTree.nodes.flatMap(node => LinkView.create(node)));

        const nodesLayer = new PIXI.Container();
        nodesLayer.addChild(...character.passiveTree.nodes.map(node => new NodeView(node)));

        this.worldScene.addChild(background, groupsLayer, linksLayer, nodesLayer);
        this.uiScene.addChild(new NodeTooltip(character));
        this.isReady = true;
    }
}