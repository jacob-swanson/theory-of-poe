import {Stage, StageProps} from "./Stage";
import {ConsoleLogger} from "../../utils/logger/ConsoleLogger";
import {observable} from "mobx";
import {Point} from "../react-pixi/ReactPIXIInternals";
import {bind} from "../../utils/bind";
import {Assert} from "../../utils/Assert";
import "./CanvasEvents";
import InteractionEvent = PIXI.interaction.InteractionEvent;

const log = new ConsoleLogger("InteractiveStage", "debug");

export interface InteractiveStageProps extends StageProps {
    /**
     * Decimal amount to zoom by. Defaults to 0.2.
     */
    zoomPercent?: number;
    /**
     * Limits the amount that can be zoomed in.
     */
    maxScale?: number;
    /**
     * Limits the amount that can be zoomed out.
     */
    minScale?: number;
    /**
     * Number of pixels to ignore before triggering onDragStart. Defaults to 10.
     */
    dragDeadZone?: number;
}

/**
 * Pixi stage that provides pan and zoom.
 */
export class InteractiveStage extends Stage<InteractiveStageProps> {
    /**
     * Default value for dragDeadZone.
     */
    private static readonly DEFAULT_DRAG_DEADZONE = 10;
    /**
     * World position offset.
     */
    @observable
    public worldPosition: Point = {x: 0, y: 0};
    /**
     * World scale.
     */
    @observable
    public worldScale: Point = {x: 1, y: 1};
    /**
     * True while the pointer is down.
     */
    @observable
    private isPointerDown: boolean = false;
    /**
     * True while a drag is occurring, false otherwise.
     */
    @observable
    private isDragging: boolean = false;
    /**
     * Previous location of the pointer last time it was moved.
     */
    private previousPointerPosition: Point = {x: 0, y: 0};

    /**
     * Cumulative distance that the mouse has moved during a drag.
     */
    private distanceMoved = 0;

    public componentDidMount() {
        super.componentDidMount();
        const app = Assert.notNull(this.app, "app must be set");

        app.renderer.plugins.interaction.on("pointerdown", this.onPointerDown);
        app.renderer.plugins.interaction.on("pointermove", this.onPointerMove);
        app.renderer.plugins.interaction.on("pointerup", this.onPointerUp);
        app.renderer.plugins.interaction.on("pointerupoutside", this.onPointerUp);
        app.renderer.plugins.canvasevents.on("oncanvaswheel", this.onWheel);
        app.renderer.plugins.canvasevents.on("oncanvasmousedown", this.onCanvasMouseDown);
    }

    // protected getAdditionalCanvasProps(): {} {
    //     return {
    //         onWheel: this.onWheel,
    //         onMouseDown: this.onCanvasMouseDown
    //     };
    // }

    /**
     * Mark the start of a drag operation.
     * @param e
     */
    @bind
    private onPointerDown(e: InteractionEvent): void {
        log.trace("InteractiveStage.onDragStart", {e});

        this.isPointerDown = true;
        this.previousPointerPosition.x = e.data.global.x;
        this.previousPointerPosition.y = e.data.global.y;
        this.distanceMoved = 0;
    }

    private onDragStart(e: InteractionEvent): void {
        this.isDragging = true;
    }

    /**
     * Update the current drag if there's one in progress.
     * @param e
     */
    @bind
    private onPointerMove(e: InteractionEvent): void {
        if (!this.isPointerDown) {
            return;
        }

        const dx = e.data.global.x - this.previousPointerPosition.x;
        const dy = e.data.global.y - this.previousPointerPosition.y;

        this.distanceMoved += Math.abs(dx) + Math.abs(dy);

        this.previousPointerPosition.x = e.data.global.x;
        this.previousPointerPosition.y = e.data.global.y;

        const {dragDeadZone} = this.props;
        if (this.distanceMoved > (dragDeadZone || InteractiveStage.DEFAULT_DRAG_DEADZONE)) {
            this.onDragStart(e);

            this.worldPosition.x += dx;
            this.worldPosition.y += dy;
        }
    }

    /**
     * Zoom in or out.
     * @param e
     */
    @bind
    private onWheel(e: WheelEvent): void {
        log.info("On wheel!");
        if (!this.app) {
            throw new Error("app not set");
        }

        const delta = e.deltaY || e.wheelDelta;
        const direction = delta > 0 ? -1 : 1;
        const zoomPercent = this.props.zoomPercent || 0.2;
        let newScale = {
            x: this.worldScale.x + direction * zoomPercent * this.worldScale.x,
            y: this.worldScale.y + direction * zoomPercent * this.worldScale.y
        };
        if (this.props.minScale) {
            newScale = {
                x: Math.max(newScale.x, this.props.minScale),
                y: Math.max(newScale.y, this.props.minScale)
            };
        }
        if (this.props.maxScale) {
            newScale = {
                x: Math.min(newScale.x, this.props.maxScale),
                y: Math.min(newScale.y, this.props.maxScale)
            };
        }

        const stagePosition = {
            x: this.worldPosition.x,
            y: this.worldPosition.y
        };
        const mouseScreenPosition = this.app.renderer.plugins.interaction.mouse.global;
        const mouseWorldPosition = {
            x: (mouseScreenPosition.x - stagePosition.x) / this.worldScale.x,
            y: (mouseScreenPosition.y - stagePosition.y) / this.worldScale.y
        };
        const newMouseScreenPosition = {
            x: mouseWorldPosition.x * newScale.x + stagePosition.x,
            y: mouseWorldPosition.y * newScale.y + stagePosition.y
        };
        const positionDelta = {
            x: newMouseScreenPosition.x - mouseScreenPosition.x,
            y: newMouseScreenPosition.y - mouseScreenPosition.y
        };

        this.worldScale.x = newScale.x;
        this.worldScale.y = newScale.y;
        this.worldPosition.x -= positionDelta.x;
        this.worldPosition.y -= positionDelta.y;
    }

    /**
     * Stop the current drag if there is one.
     * @param e
     */
    @bind
    private onPointerUp(e: InteractionEvent): void {
        log.trace("InteractiveStage.onDragEnd", {e});

        this.isDragging = false;
        this.isPointerDown = false;
    }

    /**
     * Prevents selection when the panning and the cursor leaves the canvas.
     * @param e
     */
    @bind
    private onCanvasMouseDown(e: MouseEvent): void {
        log.info("InteractiveStage.onCanvasMouseDown", {e});

        e.preventDefault();
    }
}