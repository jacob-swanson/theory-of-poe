import {NodeState} from "../../stores/passive-skill-tree/NodeState";
import * as React from "react";
import {Component} from "react";
import {observer} from "mobx-react";

export interface LinkComponentProps {
    from: NodeState;
    to: NodeState;
}

@observer
export class LinkComponent extends Component<LinkComponentProps> {
    public render() {
        const {from, to} = this.props;
        const isAllocated = from.isAllocated && to.isAllocated;
        const color = isAllocated ? 0xA1EE33 : 0xE4E4E4;
        const width = isAllocated ? 10 : 5;
        return (
            <pixi-line from={from.position} to={to.position} width={width} color={color}/>
        );
    }
}