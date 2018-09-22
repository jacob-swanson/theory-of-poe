import {ReactPIXIComponent} from "./ReactPIXIComponent";
import {Point} from "./ReactPIXIInternals";

export interface ReactPIXIArcProps {
    center: Point;
    radius: number;
    startAngle: number;
    endAngle: number;
    width: number;
    color: number;
    anticlockwise?: boolean;
}

export class ReactPIXIArc extends PIXI.Graphics implements ReactPIXIComponent<ReactPIXIArcProps> {
    public update(oldProps: ReactPIXIArcProps, newProps: ReactPIXIArcProps): void {
        this.clear();
        this.lineStyle(newProps.width, newProps.color);
        this.arc(newProps.center.x, newProps.center.y, newProps.radius, newProps.startAngle, newProps.endAngle, newProps.anticlockwise);
        this.endFill();
    }
}