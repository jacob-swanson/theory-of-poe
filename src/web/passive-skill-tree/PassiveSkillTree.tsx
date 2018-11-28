import * as React from "react";
import {Component} from "react";
import {inject, observer} from "mobx-react";
import "./PassiveSkillTree.css";
import {InteractiveStage} from "../react-pixi/InteractiveStage";
import {GroupComponent} from "./GroupComponent";
import {NodeComponent} from "./NodeComponent";
import {LinkComponent} from "./LinkComponent";
import {List} from "../components/List";
import {Group} from "../../gamedata/Group";
import {Node} from "../../gamedata/Node";
import {Character} from "../../gamedata/Character";

function renderBackground() {
    return (
        <pixi-tiling-sprite
            url="gamedata/3.3.1/assets/Background1-0.3835.png"
            size={{x: 1000000, y: 1000000}}
            position={{x: -500000, y: -500000}}
        />
    );
}

function renderGroup(group: Group) {
    return <GroupComponent key={group.id} group={group}/>;
}


function renderNode(node: Node) {
    return <NodeComponent key={node.id} node={node}/>;
}

function renderLink(node: Node) {
    const links = [];
    for (const neighborNode of node.neighbors) {
        const isGreater = node.id > neighborNode.id;
        const isAscendancy = node.ascendancyName !== neighborNode.ascendancyName;
        const isClassStart = node.isClassStart || neighborNode.isClassStart;
        const shouldIgnore = isGreater && !isAscendancy && !isClassStart;
        if (shouldIgnore) {
            links.push(<LinkComponent key={`${node.id}-${neighborNode.id}`} from={node} to={neighborNode}/>);
        }
    }
    return links;
}


export interface PassiveSkillTreeProps {
    character?: Character
}

@inject("character")
@observer
export class PassiveSkillTree extends Component<PassiveSkillTreeProps> {
    public render() {
        const {character} = this.props;
        if (!character) {
            return null;
        }
        return (
            <InteractiveStage
                className="PassiveSkillTree"
                minScale={0.1}
                maxScale={5}
            >
                {renderBackground()}
                <List values={character.passiveTree.groups.values()} map={renderGroup}/>
                <List values={character.passiveTree.nodes} map={renderLink}/>
                <List values={character.passiveTree.nodes} map={renderNode}/>
            </InteractiveStage>
        );
    }
}