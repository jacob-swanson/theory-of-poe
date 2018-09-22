import * as PIXI from "pixi.js";
import {ReactPIXIComponent} from "./ReactPIXIComponent";
import {Point} from "./ReactPIXIInternals";

export interface ReactPIXIContainerProps {
    url?: string;
    position?: Point;
    children?: any;
    onClick?: () => void;
}

export class ReactPIXIContainer extends PIXI.Container implements ReactPIXIComponent<ReactPIXIContainerProps> {
    public update(oldProps: ReactPIXIContainerProps, newProps: ReactPIXIContainerProps): void {
        if (newProps.position && oldProps.position !== newProps.position) {
            this.x = newProps.position.x;
            this.y = newProps.position.y;
        }

        if (newProps.onClick && oldProps.onClick !== newProps.onClick) {
            this.interactive = true;
            this.buttonMode = true;
            this.on("pointerup", newProps.onClick);
        }
    }
}