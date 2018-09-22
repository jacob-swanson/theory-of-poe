import {NodeAllocationState, NodeState} from "../../stores/passive-skill-tree/NodeState";
import * as React from "react";
import {Component} from "react";
import {observer} from "mobx-react";

enum LinkType {
    Arc,
    Line
}

const lineUrlByType = {
    [NodeAllocationState.Allocated]: "gamedata/3.3.1/assets/LineConnectorActive-0.3835.png",
    [NodeAllocationState.Unallocated]: "gamedata/3.3.1/assets/LineConnectorNormal-0.3835.png",
    [NodeAllocationState.CanAllocate]: "gamedata/3.3.1/assets/LineConnectorIntermediate-0.3835.png"
};

const arcUrlByOrbitByType = {
    [NodeAllocationState.Allocated]: [
        "gamedata/3.3.1/assets/Orbit1Active-0.3835.png",
        "gamedata/3.3.1/assets/Orbit2Active-0.3835.png",
        "gamedata/3.3.1/assets/Orbit3Active-0.3835.png",
        "gamedata/3.3.1/assets/Orbit4Active-0.3835.png"
    ],
    [NodeAllocationState.Unallocated]: [
        "gamedata/3.3.1/assets/Orbit1Normal-0.3835.png",
        "gamedata/3.3.1/assets/Orbit2Normal-0.3835.png",
        "gamedata/3.3.1/assets/Orbit3Normal-0.3835.png",
        "gamedata/3.3.1/assets/Orbit4Normal-0.3835.png"
    ],
    [NodeAllocationState.CanAllocate]: [
        "gamedata/3.3.1/assets/Orbit1Intermediate-0.3835.png",
        "gamedata/3.3.1/assets/Orbit2Intermediate-0.3835.png",
        "gamedata/3.3.1/assets/Orbit3Intermediate-0.3835.png",
        "gamedata/3.3.1/assets/Orbit4Intermediate-0.3835.png"
    ]
};

export interface LinkComponentProps {
    from: NodeState;
    to: NodeState;
}

@observer
export class LinkComponent extends Component<LinkComponentProps> {
    public render() {
        const {from, to} = this.props;
        const linkType = from.group === to.group && from.orbit === to.orbit ? LinkType.Arc : LinkType.Line;
        const isAllocated = from.isAllocated && to.isAllocated;
        const color = isAllocated ? 0xA1EE33 : 0xE4E4E4;
        const width = isAllocated ? 10 : 5;

        return linkType === LinkType.Line ?
            this.renderLine(width, color) :
            this.renderArc(width, color);
    }

    private renderLine(width: number, color: number) {
        const {from, to} = this.props;

        return <pixi-line from={from.position} to={to.position} width={width} color={color}/>;
    }

    private renderArc(width: number, color: number) {
        const {from, to} = this.props;

        const center = from.group.position;
        const radius = from.group.passiveTree.orbitRadii[from.orbit];
        const fromTheta = 2 * Math.PI * from.orbitIndex / from.group.passiveTree.skillsPerOrbit[from.orbit] - Math.PI / 2;
        const toTheta = 2 * Math.PI * to.orbitIndex / to.group.passiveTree.skillsPerOrbit[to.orbit] - Math.PI / 2;

        let fromArcLength = fromTheta - toTheta;
        if (fromArcLength < 0) {
            fromArcLength += 2 * Math.PI;
        }
        const clockwise = fromArcLength < Math.PI;

        return <pixi-arc
            center={center}
            radius={radius}
            width={width}
            color={color}
            startAngle={fromTheta}
            endAngle={toTheta}
            anticlockwise={clockwise}
        />;
    }
}