import * as React from "react";
import {StatelessComponent} from "react";
import {GroupState, GroupStateBackground} from "../../stores/passive-skill-tree/GroupState";
import {NodeComponent} from "./NodeComponent";

function renderBackground(group: GroupState) {
    switch (group.background) {
        case GroupStateBackground.Large:
            return (
                <pixi-container>
                    <pixi-sprite
                        anchor={{x: 0.5, y: 1}}
                        url="gamedata/3.3.1/assets/PSGroupBackground3-0.3835.gif"
                    />
                    <pixi-sprite
                        scale={{x: 1, y: -1}}
                        anchor={{x: 0.5, y: 1}}
                        url="gamedata/3.3.1/assets/PSGroupBackground3-0.3835.gif"
                    />
                </pixi-container>
            );
        case GroupStateBackground.Medium:
            return (
                <pixi-sprite
                    anchor={{x: 0.5, y: 0.5}}
                    url="gamedata/3.3.1/assets/PSGroupBackground2-0.3835.gif"
                />
            );
        case GroupStateBackground.None:
            return null;
        case GroupStateBackground.Small:
            return (
                <pixi-sprite
                    anchor={{x: 0.5, y: 0.5}}
                    url="gamedata/3.3.1/assets/PSGroupBackground1-0.3835.gif"
                />
            );

    }
}

function renderNodes(group: GroupState) {
    const nodes = [];
    for (const node of group.nodes.values()) {
        nodes.push(
            <NodeComponent key={node.id} node={node}/>
        );
    }
    return nodes;
}

export interface GroupProps {
    group: GroupState
}

export const GroupComponent: StatelessComponent<GroupProps> = ({group}) => {
    return (
        <pixi-container position={group.position}>
            {renderBackground(group)}
            {renderNodes(group)}
        </pixi-container>
    );
};