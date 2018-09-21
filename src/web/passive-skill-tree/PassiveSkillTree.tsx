import * as React from "react";
import {Component} from "react";
import {observer} from "mobx-react";
import "./PassiveSkillTree.css";
import {InteractiveStage} from "../webgl/InteractiveStage";
import {PassiveTreeState} from "../stores/passive-skill-tree/PassiveTreeState";
import {GroupComponent} from "./groups/GroupComponent";
import {GroupState} from "../stores/passive-skill-tree/GroupState";
import {NodeComponent} from "./groups/NodeComponent";
import {NodeState} from "../stores/passive-skill-tree/NodeState";
import {LinkComponent} from "./groups/LinkComponent";
import {node} from "prop-types";

export interface PassiveSkillTreeProps {
    data: PassiveTreeState
}

@observer
export class PassiveSkillTree extends Component<PassiveSkillTreeProps> {
    public render() {
        const {data} = this.props;
        return (
            <InteractiveStage className="PassiveSkillTree" backgroundColor={0x10bb99}>
                {this.renderGroups(data)}
                {this.renderLinks(data)}
                {this.renderNodes(data)}
            </InteractiveStage>
        );
    }

    private renderGroups(data: PassiveTreeState) {
        const groups = [];
        for (const group of data.groups.values()) {
            groups.push(<GroupComponent key={group.id} group={group}/>);
        }
        return groups;
    }

    private renderNodes(data: PassiveTreeState) {
        const nodes = [];
        for (const node of data.nodes) {
            nodes.push(
                <NodeComponent key={node.id} node={node}/>
            );
        }
        return nodes;
    }

    /**
     * Render neighbor links.
     *
     * So links aren't rendered twice, only link to nodes with a higher id.
     *
     * @param data
     */
    private renderLinks(data: PassiveTreeState) {
        const links = [];
        for (const node of data.nodes) {
            for (const neighborNode of node.connections) {
                const isGreater = node.id > neighborNode.id;
                const isAscendancy = node.ascendancyName !== neighborNode.ascendancyName;
                const shouldIgnore = isGreater && !isAscendancy;
                if (shouldIgnore) {
                    links.push(<LinkComponent key={`${node.id}-${neighborNode.id}`} from={node} to={neighborNode}/>)
                }
            }
        }
        return links;
    }
}