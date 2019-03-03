import {LoggerFactory} from "../../utils/logger/LoggerFactory";
import {bind} from "../../utils/bind";

const log = LoggerFactory.getLogger("CanvasEvents");

/**
 * Contains additional event handlers not handled by {@link InteractionManager}.
 */
export class CanvasEvents extends PIXI.utils.EventEmitter {
    constructor(private readonly renderer: PIXI.CanvasRenderer | PIXI.WebGLRenderer) {
        super();

        this.addEvents();
    }

    public addEvents(): void {
        this.renderer.view.addEventListener("wheel", this.onCanvasWheel, true);
        this.renderer.view.addEventListener("onmousedown", this.onCanvasMouseDown, true);
    }

    public removeEvents(): void {
        this.renderer.view.removeEventListener("wheel", this.onCanvasWheel, true);
        this.renderer.view.removeEventListener("onmousedown", this.onCanvasMouseDown, true);
    }

    public destroy(): void {
        this.removeEvents();
    }

    @bind
    private onCanvasWheel(e: WheelEvent): void {
        log.trace("Received wheel event", {e});

        this.emit("oncanvaswheel", e);
    }

    @bind
    private onCanvasMouseDown(e: MouseEvent): void {
        log.trace("Received wheel event", {e});
        this.emit("oncanvasmousedown", e);
    }
}

PIXI.WebGLRenderer.registerPlugin("canvasevents", CanvasEvents);
PIXI.CanvasRenderer.registerPlugin("canvasevents", CanvasEvents);