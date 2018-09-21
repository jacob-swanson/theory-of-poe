import {ReactPIXIComponent} from "./ReactPIXIComponent";
import {Point} from "./ReactPIXIInternals";

export interface ReactPIXILineProps {
    from: Point;
    to: Point;
    width?: number;
    color?: number;
}

export class ReactPIXILine extends PIXI.Graphics implements ReactPIXIComponent<ReactPIXILineProps> {
    public isReactPIXIComponent: "ReactPIXIComponent";

    public update(oldProps: ReactPIXILineProps, newProps: ReactPIXILineProps): void {
        this.lineStyle(newProps.width, newProps.color);
        this.moveTo(newProps.from.x, newProps.from.y);
        this.lineTo(newProps.to.x, newProps.to.y);
        this.endFill();
    }
}