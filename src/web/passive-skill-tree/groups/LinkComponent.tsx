import {NodeState} from "../../stores/passive-skill-tree/NodeState";
import * as React from "react";
import {StatelessComponent} from "react";

export interface LinkComponentProps {
    from: NodeState;
    to: NodeState;
}

export const LinkComponent: StatelessComponent<LinkComponentProps> = ({from, to}) => {
    const isAllocated = from.isAllocated && to.isAllocated;
    const color = isAllocated ? 0xE4E4E4 : 0xA1EE33;
    const width = isAllocated ? 10 : 5;
    return (
        <pixi-line from={from.position} to={to.position} width={width} color={color}/>
    );
};