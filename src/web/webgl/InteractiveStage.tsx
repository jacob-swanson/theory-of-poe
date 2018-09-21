import {Stage, StageProps} from "./Stage";
import {ConsoleLogger} from "../../utils/logger/ConsoleLogger";
import InteractionEvent = PIXI.interaction.InteractionEvent;

const log = new ConsoleLogger("InteractiveStage", "debug");

export interface InteractiveStageProps extends StageProps{
    zoomPercent?: number
}

export class InteractiveStage extends Stage<InteractiveStageProps> {
    private isDragging = false;
    private prevX = 0;
    private prevY = 0;
    private distanceMoved = 0;

    private onMouseDown = (e: InteractionEvent) => {
        log.trace("InteractiveStage.onMouseDown", {e});

        this.isDragging = true;
        this.prevX = e.data.global.x;
        this.prevY = e.data.global.y;
        this.distanceMoved = 0;
    };

    private onMouseMove = (e: InteractionEvent) => {
        if (!this.isDragging || this.app == null) {
            return;
        }

        const dx = e.data.global.x - this.prevX;
        const dy = e.data.global.y - this.prevY;

        this.distanceMoved += Math.abs(dx) + Math.abs(dy);

        this.app.stage.x += dx;
        this.app.stage.y += dy;

        this.prevX = e.data.global.x;
        this.prevY = e.data.global.y;
    };

    private onWheel = (e: WheelEvent) => {
        if (!this.app) {
            throw new Error("app not set");
        }

        e.preventDefault();
        const scale = this.app.stage.scale;
        const delta = e.deltaY || e.wheelDelta;
        const direction = delta > 0 ? -1 : 1;
        const zoomPercent = this.props.zoomPercent || 0.2;
        const newScale = {
            x: scale.x + direction * zoomPercent * scale.x,
            y: scale.y + direction * zoomPercent * scale.y
        };


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

    private onMouseUp = (e: InteractionEvent) => {
        log.trace("InteractiveStage.onMouseUp", {e});

        this.isDragging = false;
    };

    public componentDidMount() {
        super.componentDidMount();
        if (!this.app) {
            throw new Error("app not set");
        }

        this.app.renderer.plugins.interaction.on("mousedown", this.onMouseDown);
        this.app.renderer.plugins.interaction.on("mousemove", this.onMouseMove);
        this.app.renderer.plugins.interaction.on("pointerup", this.onMouseUp);
    }

    protected getAdditionalProps(): {} {
        return {
            onWheel: this.onWheel
        };
    }
}