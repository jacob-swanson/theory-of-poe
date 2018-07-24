import * as React from "react";
import {Sprite, Stage} from "react-pixi-fiber";
import bunny from "./bunny.png";
import * as PIXI from "pixi.js";
import {observer} from "mobx-react";
import {observable} from "mobx";
import * as _ from "lodash";

declare module "react-pixi-fiber" {
    export interface StageProperties extends Component<PIXI.Container> {
        className?: string
    }
}

function Bunny(props: any) {
    return (
        <Sprite texture={PIXI.Texture.fromImage(bunny)} {...props} />
    );
}

@observer
export class PassiveSkillTree extends React.Component {
    @observable protected width = window.innerWidth;
    @observable protected height = window.innerHeight;

    private onWindowResize = _.debounce(() => {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
    }, 64);

    public componentDidMount(): void {
        this.onWindowResize();
        window.addEventListener("resize", this.onWindowResize);
    }

    public componentWillUnmount(): void {
        window.removeEventListener("resize", this.onWindowResize);
    }

    public render() {
        return (
            <Stage className="App-PassiveSkillTree" width={this.width} height={this.height}
                   options={{backgroundColor: 0x10bb99}}>
                <Bunny x={this.width / 2} y={this.height / 2}/>
            </Stage>
        );
    }
}