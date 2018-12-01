import {inject, observer} from "mobx-react";
import {Character} from "../../gamedata/Character";
import {PassiveTreeNodeView} from "./PassiveTreeNodeView";
import {InteractiveStage} from "./InteractiveStage";
import * as React from "react";
import {Component} from "react";
import {GroupView} from "./GroupView";
import {Node} from "../../gamedata/Node";
import {PassiveTree} from "../../gamedata/PassiveTree";
import {autorun, observable} from "mobx";
import {bind} from "../../utils/bind";

export interface PassiveSkillTreeProps {
    character?: Character
}

@inject("character")
@observer
export class PassiveTreeView extends Component<PassiveSkillTreeProps> {
    @observable
    private children: PIXI.DisplayObject[] = [];

    public componentDidMount(): void {
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

    public render(): any {
        if (this.children.length > 0) {
            return (
                <InteractiveStage
                    autoStart={true}
                    minScale={0.1}
                    maxScale={2}
                >
                    {this.children}
                </InteractiveStage>
            );
        } else {
            return "Loading...";
        }
    }

    private createLinks(from: Node): PIXI.DisplayObject[] {
        const links = [];
        for (const to of from.neighbors) {
            const isGreater = from.id > to.id;
            const isAscendancy = from.ascendancyName !== to.ascendancyName;
            const isClassStart = from.isClassStart || to.isClassStart;
            const shouldDisplay = isGreater && !isAscendancy && !isClassStart;
            if (shouldDisplay) {
                const isArc = from.group === to.group && from.orbit === to.orbit;
                if (isArc) {
                    const arc = new PIXI.Graphics();
                    links.push(arc);

                    autorun(() => {
                        const isAllocated = from.isAllocated && to.isAllocated;
                        const color = isAllocated ? 0x839574 : 0x373B33;
                        const width = isAllocated ? 10 : 5;

                        const center = from.group.position;
                        const radius = PassiveTree.orbitRadii[from.orbit];
                        const fromTheta = 2 * Math.PI * from.orbitIndex / PassiveTree.skillsPerOrbit[from.orbit] - Math.PI / 2;
                        const toTheta = 2 * Math.PI * to.orbitIndex / PassiveTree.skillsPerOrbit[to.orbit] - Math.PI / 2;

                        let arcTheta = fromTheta - toTheta;
                        if (arcTheta < 0) {
                            arcTheta += 2 * Math.PI;
                        }
                        const clockwise = arcTheta < Math.PI;

                        arc.clear();
                        arc.lineStyle(width, color);
                        arc.arc(center.x, center.y, radius, fromTheta, toTheta, clockwise);
                        arc.endFill();
                    });
                } else {
                    const line = new PIXI.Graphics();
                    links.push(line);

                    autorun(() => {
                        line.clear();
                        const isAllocated = from.isAllocated && to.isAllocated;
                        const color = isAllocated ? 0x839574 : 0x373B33;
                        const width = isAllocated ? 10 : 5;
                        line.lineStyle(width, color);
                        line.moveTo(from.position.x, from.position.y);
                        line.lineTo(to.position.x, to.position.y);
                        line.endFill();
                    });
                }
            }
        }
        return links;
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
        groupsLayer.addChild(...character.passiveTree.groupsList.map(group => new GroupView(group)));

        const linksLayer = new PIXI.Container();
        linksLayer.addChild(...character.passiveTree.nodes.flatMap(node => this.createLinks(node)));

        const nodesLayer = new PIXI.Container();
        nodesLayer.addChild(...character.passiveTree.nodes.map(node => new PassiveTreeNodeView(node)));

        this.children = [background, groupsLayer, linksLayer, nodesLayer];
    }
}