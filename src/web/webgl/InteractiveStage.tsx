import {Stage} from "./Stage";
import {ConsoleLogger} from "../../utils/logger/ConsoleLogger";
import InteractionEvent = PIXI.interaction.InteractionEvent;

const log = new ConsoleLogger("InteractiveStage", "trace");

export class InteractiveStage extends Stage {
    private isDragging = false;
    private prevX = 0;
    private prevY = 0;
    private distanceMoved = 0;

    public componentDidMount() {
        super.componentDidMount();

        if (!this.app) {
            throw new Error('app not set')
        }

        this.app.renderer.plugins.interaction.on('mousedown', this.onMouseDown);
        this.app.renderer.plugins.interaction.on('mousemove', this.onMouseMove);
        this.app.renderer.plugins.interaction.on('pointerup', this.onMouseUp);
    }

    private onMouseDown = (e: InteractionEvent) => {
        log.trace("InteractiveStage.onMouseDown", {e});

        this.isDragging = true;
        this.prevX = e.data.global.x;
        this.prevY = e.data.global.y;
        this.distanceMoved = 0;
    };

    private onMouseMove = (e: InteractionEvent) => {
        log.trace("InteractiveStage.onMouseMove", {e});

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

    private onMouseUp = (e: InteractionEvent) => {
        log.trace("InteractiveStage.onMouseUp", {e});

        this.isDragging = false;
    };
}