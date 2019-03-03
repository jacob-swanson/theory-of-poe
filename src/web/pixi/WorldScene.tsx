import {Scene} from "./Scene";
import {Assert} from "../../utils/Assert";
import {bind} from "../../utils/bind";

export class WorldScene extends Scene {
    @bind
    protected update() {
        const stage = Assert.notNull(this.stage, "stage must be set");
        this.x = stage.worldPosition.x;
        this.y = stage.worldPosition.y;
        this.scale.x = stage.worldScale.x;
        this.scale.y = stage.worldScale.y;
    }
}