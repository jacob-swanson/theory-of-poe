import {Stage, StageProps} from "./Stage";
import {ConsoleLogger} from "../../utils/logger/ConsoleLogger";
import InteractionEvent = PIXI.interaction.InteractionEvent;

const log = new ConsoleLogger("InteractiveStage", "debug");

export interface InteractiveStageProps extends StageProps {
    zoomPercent?: number;
    maxScale?: number;
    minScale?: number;
}

export class InteractiveStage extends Stage<InteractiveStageProps> {
    private isDragging = false;
    private prevX = 0;
    private prevY = 0;
    private distanceMoved = 0;

    private onDragStart = (e: InteractionEvent) => {
        log.trace("InteractiveStage.onDragStart", {e});

        this.isDragging = true;
        this.prevX = e.data.global.x;
        this.prevY = e.data.global.y;
        this.distanceMoved = 0;
    };

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
    };

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

        this.app.stage.scale = new PIXI.Point(newScale.x, newScale.y);
        this.app.stage.x -= positionDelta.x;
        this.app.stage.y -= positionDelta.y;
    };

    private onDragEnd = (e: InteractionEvent) => {
        log.trace("InteractiveStage.onDragEnd", {e});

        this.isDragging = false;
    };

    /**
     * Prevents selection when the panning and the cursor leaves the canvas.
     *
     * @param e
     */
    private onCanvasMouseDown = (e: MouseEvent) => {
        log.trace("InteractiveStage.onCanvasMouseDown", {e});

        e.preventDefault();
    };

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

    public componentWillUnmount() {
    }

    protected getAdditionalProps(): {} {
        return {
            onWheel: this.onWheel,
            onMouseDown: this.onCanvasMouseDown
        };
    }
}