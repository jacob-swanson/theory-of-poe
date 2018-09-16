import * as React from "react";
import {StatelessComponent} from "react";
import {GroupProps} from "./GroupProps";

export const SmallGroup: StatelessComponent<GroupProps> = ({x, y}) => (
    <sprite
        x={x}
        y={y}
        url="gamedata/3.3.1/assets/PSGroupBackground1-0.3835.gif"
    />
);