import {autorun, IReactionDisposer} from "mobx";
import {bind} from "../../utils/bind";

export abstract class Scene extends PIXI.Container {
    private dispose: IReactionDisposer;

    constructor() {
        super();
    }

    public start() {
        this.dispose = autorun(this.boundUpdate);
    }

    public stop() {
        if (this.dispose) {
            this.dispose();
        }
    }

    public destroy(options?: PIXI.DestroyOptions | boolean): void {
        this.stop();
        super.destroy(options);
    }

    protected abstract update(): void;

    /**
     * Bind here, so we don't have to deal with bind weirdness elsewhere.
     */
    @bind
    private boundUpdate() {
        this.update();
    }
}

