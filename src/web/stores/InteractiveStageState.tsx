import {LoggerFactory} from "../../utils/logger/LoggerFactory";
import {bind} from "../../utils/bind";
import {action, observable} from "mobx";
import {Point, ReadonlyPoint} from "../react-pixi/ReactPIXIInternals";
import "./../pixi/CanvasEvents";
import InteractionEvent = PIXI.interaction.InteractionEvent;

const log = LoggerFactory.getLogger("InteractiveSceneState");

export interface InteractiveSceneProps {
    /**
     * The PIXI application for event handling.
     */
    app: PIXI.Application;
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

export class InteractiveSceneState {
    /**
     * Default value for dragDeadZone.
     */
    private static readonly DEFAULT_DRAG_DEADZONE = 10;
    /**
     * True while the pointer is down.
     */
    @observable
    private isPointerDown: boolean = false;
    /**
     * Previous location of the pointer last time it was moved.
     */
    private previousPointerPosition: Point = {x: 0, y: 0};
    /**
     * Cumulative distance that the mouse has moved during a drag.
     */
    private distanceMoved: number = 0;

    constructor(private readonly props: InteractiveSceneProps) {
        const {app} = props;
        app.renderer.plugins.interaction.on("pointerdown", this.onPointerDown);
        app.renderer.plugins.interaction.on("pointermove", this.onPointerMove);
        app.renderer.plugins.interaction.on("pointerup", this.onPointerUp);
        app.renderer.plugins.interaction.on("pointerupoutside", this.onPointerUp);
        app.renderer.plugins.canvasevents.on("oncanvaswheel", this.onWheel);
        app.renderer.plugins.canvasevents.on("oncanvasmousedown", this.onCanvasMouseDown);
    }

    /**
     * World scale.
     */
    @observable
    private readonly _worldScale: Point = {x: 1, y: 1};

    public get worldScale(): ReadonlyPoint {
        return this._worldScale;
    }

    /**
     * World position offset.
     */
    @observable
    private readonly _worldPosition: Point = {x: 0, y: 0};

    public get worldPosition(): ReadonlyPoint {
        return this._worldPosition;
    }

    /**
     * True while a drag is occurring, false otherwise.
     */
    @observable
    private _isDragging: boolean = false;

    public get isDragging(): boolean {
        return this._isDragging;
    }

    public destroy() {
        const {app} = this.props;
        app.renderer.plugins.interaction.off("pointerdown", this.onPointerDown);
        app.renderer.plugins.interaction.off("pointermove", this.onPointerMove);
        app.renderer.plugins.interaction.off("pointerup", this.onPointerUp);
        app.renderer.plugins.interaction.off("pointerupoutside", this.onPointerUp);
        app.renderer.plugins.canvasevents.off("oncanvaswheel", this.onWheel);
        app.renderer.plugins.canvasevents.off("oncanvasmousedown", this.onCanvasMouseDown);
    }

    /**
     * Mark the start of a drag operation.
     * @param e
     */
    @action.bound
    private onPointerDown(e: InteractionEvent): void {
        this.isPointerDown = true;
        this.previousPointerPosition.x = e.data.global.x;
        this.previousPointerPosition.y = e.data.global.y;
        this.distanceMoved = 0;
    }

    /**
     * Update the current drag if there's one in progress.
     * @param e
     */
    @action.bound
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
        if (this.distanceMoved > (dragDeadZone || InteractiveSceneState.DEFAULT_DRAG_DEADZONE)) {
            this._isDragging = true;
            this._worldPosition.x += dx;
            this._worldPosition.y += dy;
        }
    }

    /**
     * Stop the current drag if there is one.
     * @param e
     */
    @action.bound
    private onPointerUp(e: InteractionEvent): void {
        this._isDragging = false;
        this.isPointerDown = false;
    }

    /**
     * Zoom in or out.
     * @param e
     */
    @action.bound
    private onWheel(e: WheelEvent): void {
        const delta = e.deltaY || e.wheelDelta;
        const direction = delta > 0 ? -1 : 1;
        const zoomPercent = this.props.zoomPercent || 0.2;
        let newScale = {
            x: this._worldScale.x + direction * zoomPercent * this._worldScale.x,
            y: this._worldScale.y + direction * zoomPercent * this._worldScale.y
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
            x: this._worldPosition.x,
            y: this._worldPosition.y
        };
        const {app} = this.props;
        const mouseScreenPosition = app.renderer.plugins.interaction.mouse.global;
        const mouseWorldPosition = {
            x: (mouseScreenPosition.x - stagePosition.x) / this._worldScale.x,
            y: (mouseScreenPosition.y - stagePosition.y) / this._worldScale.y
        };
        const newMouseScreenPosition = {
            x: mouseWorldPosition.x * newScale.x + stagePosition.x,
            y: mouseWorldPosition.y * newScale.y + stagePosition.y
        };
        const positionDelta = {
            x: newMouseScreenPosition.x - mouseScreenPosition.x,
            y: newMouseScreenPosition.y - mouseScreenPosition.y
        };

        this._worldScale.x = newScale.x;
        this._worldScale.y = newScale.y;
        this._worldPosition.x -= positionDelta.x;
        this._worldPosition.y -= positionDelta.y;
    }

    /**
     * Prevents selection when the panning and the cursor leaves the canvas.
     * @param e
     */
    @bind
    private onCanvasMouseDown(e: MouseEvent): void {
        e.preventDefault();
    }
}