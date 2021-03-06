import {inject, observer} from "mobx-react";
import {Character} from "../../gamedata/Character";
import {NodeView} from "./NodeView";
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
import {Stage} from "../pixi/Stage";
import {NodeTooltip} from "./NodeTooltip";
import {Assert} from "../../utils/Assert";
import {LoggerFactory} from "../../utils/logger/LoggerFactory";
import {InteractiveScene} from "../pixi/InteractiveScene";
import {InteractiveSceneState} from "../stores/InteractiveStageState";
import * as PIXI from "pixi.js";

const log = LoggerFactory.getLogger("PassiveTreeView");

export interface PassiveSkillTreeProps {
    character?: Character
}

@inject("character")
@observer
export class PassiveTreeView extends Component<PassiveSkillTreeProps> {
    private static areAssetsLoaded = false;
    @observable
    private isReady: boolean = false;

    public render(): any {
        if (this.isReady) {
            return (
                <Stage
                    className="PassiveTreeView"
                    autoStart={true}
                    onLoad={this.createChildren}
                />
            );
        } else {
            return "Loading...";
        }
    }

    public componentDidMount(): void {
        if (!PassiveTreeView.areAssetsLoaded) {
            this.loadAssets();
            PassiveTreeView.areAssetsLoaded = true;
        }
    }

    private loadAssets(): void {
        const character = Assert.notNull(this.props.character, "character must be set");

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
        log.info("Loading assets");
        loader.load(() => this.isReady = true);
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
    private createChildren(app: PIXI.Application): void {
        const character = Assert.notNull(this.props.character, "character must be set");

        const background = new PIXI.extras.TilingSprite(
            PIXI.loader.resources.Background1.texture,
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

        const interactiveSceneState = new InteractiveSceneState({app, minScale: 0.1, maxScale: 2});
        const worldScene = new InteractiveScene(interactiveSceneState);
        worldScene.addChild(background, groupsLayer, linksLayer, nodesLayer);

        const uiScene = new PIXI.Container();
        uiScene.addChild(new NodeTooltip(character, interactiveSceneState));

        app.stage.addChild(worldScene);
        app.stage.addChild(uiScene);
    }
}