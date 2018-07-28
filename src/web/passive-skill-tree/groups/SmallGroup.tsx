import * as React from "react";
import {Sprite} from "react-pixi-fiber";
import * as PIXI from "pixi.js";
import {StatelessComponent} from "react";
import {GroupProps} from "./GroupProps";

export const SmallGroup: StatelessComponent<GroupProps> = ({x, y}) => (
    <Sprite
        x={x}
        y={y}
        texture={PIXI.Texture.fromImage("gamedata/3.3.1/assets/PSGroupBackground1-0.3835.gif")}
    />
);