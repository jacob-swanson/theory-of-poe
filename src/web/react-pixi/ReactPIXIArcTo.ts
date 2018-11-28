import {ReactPIXIComponent} from "./ReactPIXIComponent";
import {Point} from "./ReactPIXIInternals";

export interface ReactPIXIArcToProps {
    from: Point;
    to: Point;
    radius: number;
    width: number;
    color: number;
}

export class ReactPIXIArcTo extends PIXI.Graphics implements ReactPIXIComponent<ReactPIXIArcToProps> {
    public update(oldProps: ReactPIXIArcToProps, newProps: ReactPIXIArcToProps): void {
        this.lineStyle(newProps.width, newProps.color);
        this.moveTo(newProps.from.x, newProps.from.y);
        this.arcTo(0, 0, newProps.to.x, newProps.to.y, newProps.radius);
        this.endFill();
    }
}