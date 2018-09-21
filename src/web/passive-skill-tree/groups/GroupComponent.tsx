import * as React from "react";
import {StatelessComponent} from "react";
import {GroupState, GroupStateBackground} from "../../stores/passive-skill-tree/GroupState";

export interface GroupProps {
    group: GroupState
}

export const GroupComponent: StatelessComponent<GroupProps> = ({group}) => {
    switch (group.background) {
        case GroupStateBackground.Large:
            return (
                <pixi-container position={group.position}>
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
                    position={group.position}
                    anchor={{x: 0.5, y: 0.5}}
                    url="gamedata/3.3.1/assets/PSGroupBackground2-0.3835.gif"
                />
            );
        case GroupStateBackground.None:
            return null;
        case GroupStateBackground.Small:
            return (
                <pixi-sprite
                    position={group.position}
                    anchor={{x: 0.5, y: 0.5}}
                    url="gamedata/3.3.1/assets/PSGroupBackground1-0.3835.gif"
                />
            );
    }
};