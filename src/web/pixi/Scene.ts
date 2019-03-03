import {autorun, IReactionDisposer} from "mobx";
import {InteractiveStage} from "./InteractiveStage";

export class Scene extends PIXI.Container {
    protected stage: InteractiveStage | null = null;
    private dispose: IReactionDisposer;

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

    protected update() {
        // do nothing
    }
}