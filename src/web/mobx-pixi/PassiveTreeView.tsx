import {inject} from "mobx-react";
import {Character} from "../../gamedata/Character";
import {MobxPixiNodeView} from "../passive-skill-tree/NodeComponent";
import {InteractiveStage} from "./InteractiveStage";
import * as React from "react";
import {Component} from "react";
import {memoize} from "../../utils/memoize";

export interface PassiveSkillTreeProps {
    character?: Character
}

@inject("character")
export class PassiveTreeView extends Component<PassiveSkillTreeProps> {
    public render(): any {
        return (
            <InteractiveStage children={this.createNodes()} autoStart={true}/>
        );
    }

    private createNodes(): MobxPixiNodeView[] {
        const {character} = this.props;
        if (character === undefined) {
            throw new Error("character was undefined");
        }

        return character.passiveTree.nodes.map(node => new MobxPixiNodeView(node));
    }
}