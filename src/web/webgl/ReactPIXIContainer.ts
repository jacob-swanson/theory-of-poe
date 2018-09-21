import * as PIXI from "pixi.js";
import {ReactPIXIComponent} from "./ReactPIXIComponent";
import {Point} from "./ReactPIXIInternals";

export interface ReactPIXIContainerProps {
    url?: string;
    position?: Point;
    children?: any;
}

export class ReactPIXIContainer extends PIXI.Container implements ReactPIXIComponent<ReactPIXIContainerProps> {
    public type: "ReactPIXIComponent";

    public update(oldProps: ReactPIXIContainerProps, newProps: ReactPIXIContainerProps): void {
        this.x = newProps.position ? newProps.position.x : this.x;
        this.y = newProps.position ? newProps.position.y : this.y;
    }
}