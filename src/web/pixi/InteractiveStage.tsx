import {Stage, StageProps} from "./Stage";
import {ConsoleLogger} from "../../utils/logger/ConsoleLogger";
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
     * Callback for when a drag starts.
     */
    onDragStart?: () => void;
    /**
     * Callback for when a drag ends.
     */
    onDragEnd?: () => void;
    onDragMove?: () => void;
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
     * True while a drag is occurring, false otherwise.
     */
    private isDragging = false;
    /**
     * Last x offsetPosition that the cursor was at.
     */
    private prevX = 0;
    /**
     * Last y offsetPosition that the cursor was at.
     */
    private prevY = 0;
    /**
     * Cumulative distance that the mouse has moved during a drag.
     */
    private distanceMoved = 0;
    /**
     * Default value for dragDeadZone.
     */
    private readonly defaultDragDeadZone = 10;

    public componentDidMount() {
        super.componentDidMount();
        if (!this.app) {
            throw new Error("app not set");
        }

        this.app.renderer.plugins.interaction.on("pointerdown", this.onDragStart);
        this.app.renderer.plugins.interaction.on("pointermove", this.onDragMove);
        this.app.renderer.plugins.interaction.on("pointerup", this.onDragEnd);
        this.app.renderer.plugins.interaction.on("pointerupoutside", this.onDragEnd);
    }

    protected getAdditionalCanvasProps(): {} {
        return {
            onWheel: this.onWheel,
            onMouseDown: this.onCanvasMouseDown
        };
    }

    /**
     * Mark the start of a drag operation.
     * @param e
     */
    private onDragStart = (e: InteractionEvent) => {
        log.trace("InteractiveStage.onDragStart", {e});

        this.isDragging = true;
        this.prevX = e.data.global.x;
        this.prevY = e.data.global.y;
        this.distanceMoved = 0;
    };

    /**
     * Update the current drag if there's one in progress.
     * @param e
     */
    private onDragMove = (e: InteractionEvent) => {
        if (!this.isDragging || this.app == null) {
            return;
        }

        const dx = e.data.global.x - this.prevX;
        const dy = e.data.global.y - this.prevY;

        this.distanceMoved += Math.abs(dx) + Math.abs(dy);

        const nextX = this.app.stage.x + dx;
        const nextY = this.app.stage.y + dy;

        this.app.stage.x = nextX;
        this.app.stage.y = nextY;

        this.prevX = e.data.global.x;
        this.prevY = e.data.global.y;

        const {onDragMove} = this.props;
        if (onDragMove) {
            onDragMove();
        }

        const {onDragStart, dragDeadZone} = this.props;
        if (this.distanceMoved > (dragDeadZone || this.defaultDragDeadZone) && onDragStart) {
            onDragStart();
        }
    };

    /**
     * Zoom in or out.
     * @param e
     */
    private onWheel = (e: WheelEvent) => {
        if (!this.app) {
            throw new Error("app not set");
        }

        const scale = this.app.stage.scale;
        const delta = e.deltaY || e.wheelDelta;
        const direction = delta > 0 ? -1 : 1;
        const zoomPercent = this.props.zoomPercent || 0.2;
        let newScale = {
            x: scale.x + direction * zoomPercent * scale.x,
            y: scale.y + direction * zoomPercent * scale.y
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
            x: this.app.stage.x,
            y: this.app.stage.y
        };
        const mouseScreenPosition = this.app.renderer.plugins.interaction.mouse.global;
        const mouseWorldPosition = {
            x: (mouseScreenPosition.x - stagePosition.x) / scale.x,
            y: (mouseScreenPosition.y - stagePosition.y) / scale.y
        };
        const newMouseScreenPosition = {
            x: mouseWorldPosition.x * newScale.x + stagePosition.x,
            y: mouseWorldPosition.y * newScale.y + stagePosition.y
        };
        const positionDelta = {
            x: newMouseScreenPosition.x - mouseScreenPosition.x,
            y: newMouseScreenPosition.y - mouseScreenPosition.y
        };

        this.app.stage.scale.x = newScale.x;
        this.app.stage.scale.y = newScale.y;
        this.app.stage.x -= positionDelta.x;
        this.app.stage.y -= positionDelta.y;
    };

    /**
     * Stop the current drag if there is one.
     * @param e
     */
    private onDragEnd = (e: InteractionEvent) => {
        log.trace("InteractiveStage.onDragEnd", {e});

        this.isDragging = false;
        const {onDragEnd} = this.props;
        if (onDragEnd) {
            onDragEnd();
        }
    };

    /**
     * Prevents selection when the panning and the cursor leaves the canvas.
     * @param e
     */
    private onCanvasMouseDown = (e: MouseEvent) => {
        log.trace("InteractiveStage.onCanvasMouseDown", {e});

        e.preventDefault();
    };
}