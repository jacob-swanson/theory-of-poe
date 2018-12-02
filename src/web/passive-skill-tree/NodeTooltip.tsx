import * as React from "react";
import {Component, ReactNode} from "react";
import {Character} from "../../gamedata/Character";
import {inject, observer} from "mobx-react";
import {CSSProperties} from "react";

export interface NodeTooltipProps {
    character?: Character;
}

@inject("character")
@observer
export class NodeTooltip extends Component<NodeTooltipProps> {
    public render(): ReactNode {
        const {character} = this.props;
        if (!character || !character.passiveTree.tooltip.node || !character.passiveTree.tooltip.node.name) {
            return null;
        }

        const styles: CSSProperties = {
            position: "absolute",
            zIndex: 9999,
            top: character.passiveTree.tooltip.position.y,
            left: character.passiveTree.tooltip.position.x,
            pointerEvents: "none"
        };
        return (
            <div style={styles}>
                {character.passiveTree.tooltip.node.name}
            </div>
        );
    }
}