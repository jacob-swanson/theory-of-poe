import * as React from "react";
import {Sprite, Stage} from "react-pixi-fiber";
import bunny from "./bunny.png";
import * as PIXI from "pixi.js";

declare module 'react-pixi-fiber' {
    export interface StageProperties extends Component<PIXI.Container> {
        className?: string
    }
}

function Bunny(props: any) {
    return (
        <Sprite texture={PIXI.Texture.fromImage(bunny)} {...props} />
    );
}

export class PassiveSkillTree extends React.Component {
    public render() {
        return (
            <Stage className="App-PassiveSkillTree" width={window.innerWidth} height={window.innerHeight} options={{backgroundColor: 0x10bb99}}>
                <Bunny x={200} y={200}/>
            </Stage>
        );
    }
}