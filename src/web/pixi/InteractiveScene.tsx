import {LoggerFactory} from "../../utils/logger/LoggerFactory";
import "./../pixi/CanvasEvents";
import {pixiObserver} from "./pixiObserver";
import {InteractiveSceneState} from "../stores/InteractiveStageState";

const log = LoggerFactory.getLogger("InteractiveScene");

export class InteractiveScene extends pixiObserver(PIXI.Container) {
    constructor(private readonly state: InteractiveSceneState) {
        super();
    }

    public react(): void {
        log.trace("InteractiveScene.react");
        this.x = this.state.worldPosition.x;
        this.y = this.state.worldPosition.y;
        this.scale.x = this.state.worldScale.x;
        this.scale.y = this.state.worldScale.y;
    }
}