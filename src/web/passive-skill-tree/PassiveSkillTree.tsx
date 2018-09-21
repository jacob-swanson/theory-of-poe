import * as React from "react";
import {Component} from "react";
import {observer} from "mobx-react";
import "./PassiveSkillTree.css";
import {InteractiveStage} from "../webgl/InteractiveStage";
import {NodeJson} from "../../gamedata/passive-skill-tree/external-data/NodeJson";
import {PassiveTreeState} from "../stores/passive-skill-tree/PassiveTreeState";
import {GroupStateBackground} from "../stores/passive-skill-tree/GroupState";
import {GroupComponent} from "./groups/GroupComponent";

export interface PassiveSkillTreeProps {
    data: PassiveTreeState
}

interface NodesByGroup {
    [key: number]: NodeJson[]
}

@observer
export class PassiveSkillTree extends Component<PassiveSkillTreeProps> {
    public render() {
        return (
            <InteractiveStage className="PassiveSkillTree" backgroundColor={0x10bb99}>
                {this.renderGroups()}
            </InteractiveStage>
        );
    }

    private renderGroups() {
        const {data} = this.props;
        if (!data) {
            return null;
        }

        const groups = [];
        for (const group of data.groups.values()) {
            groups.push(<GroupComponent key={group.id} group={group}/>)
        }
        return groups;
    }
}