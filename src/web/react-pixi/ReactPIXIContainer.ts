import * as PIXI from "pixi.js";
import {ReactPIXIComponent} from "./ReactPIXIComponent";
import {Point} from "./ReactPIXIInternals";
import {ConsoleLogger} from "../../utils/logger/ConsoleLogger";

const log = new ConsoleLogger("ReactPIXIContainer", "debug");

export interface ReactPIXIContainerProps {
    url?: string;
    position?: Point;
    children?: any;
    isInteractive?: boolean;
    onClick?: () => void;
}

export class ReactPIXIContainer extends PIXI.Container implements ReactPIXIComponent<ReactPIXIContainerProps> {
    public update(oldProps: ReactPIXIContainerProps, newProps: ReactPIXIContainerProps): void {
        log.trace("Updating container", {container: this, oldProps, newProps});
        if (this.x !== (newProps.position && newProps.position.x)) {
            this.x = newProps.position && newProps.position.x || 0;
        }
        if (this.y !== (newProps.position && newProps.position.y)) {
            this.y = newProps.position && newProps.position.y || 0;
        }

        if (oldProps.isInteractive !== newProps.isInteractive) {
            this.interactive = !!newProps.isInteractive;
            this.buttonMode = !!newProps.isInteractive;
        }

        if (oldProps.onClick !== newProps.onClick) {
            if (oldProps.onClick) {
                this.off("pointerup", oldProps.onClick);
            }
            if (newProps.onClick) {
                this.on("pointerup", newProps.onClick);
            }
        }
    }
}