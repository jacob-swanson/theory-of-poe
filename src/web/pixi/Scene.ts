import {autorun, IReactionDisposer} from "mobx";
import {bind} from "../../utils/bind";
import {Assert} from "../../utils/Assert";
import {LoggerFactory} from "../../utils/logger/LoggerFactory";
import {InteractiveStage} from "./InteractiveStage";

const log = LoggerFactory.getLogger("Scene");

export class Scene extends PIXI.Container {
    private dispose: IReactionDisposer;
    private stage: InteractiveStage | null = null;

    constructor(public readonly id: string) {
        super();
    }

    public onRegister(stage: InteractiveStage): void {
        this.stage = stage;
        this.dispose = autorun(this.update);
    }

    public destroy(options?: PIXI.DestroyOptions | boolean): void {
        super.destroy(options);
        this.dispose();
    }

    @bind
    private update() {
        const stage = Assert.notNull(this.stage, "stage must be set");
        this.x = stage.worldPosition.x;
        this.y = stage.worldPosition.y;
        this.scale.x = stage.worldScale.x;
        this.scale.y = stage.worldScale.y;
    }
}