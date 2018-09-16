import {ReactPIXIComponent} from "./ReactPIXIComponent";
import * as PIXI from 'pixi.js';

export interface ReactPIXISpriteProps {
    url?: string;
    x?: number;
    y?: number;
}

export class ReactPIXISprite extends PIXI.Sprite implements ReactPIXIComponent<ReactPIXISpriteProps> {
    public type: "ReactPIXIComponent";

    constructor(texture?: PIXI.Texture) {
        super(texture);
    }

    public update(oldProps: ReactPIXISpriteProps, newProps: ReactPIXISpriteProps): void {
        if (newProps.url && oldProps.url !== newProps.url) {
            this.texture = PIXI.Texture.fromImage(newProps.url);
        }
        this.x = newProps.x || this.x;
        this.y = newProps.y || this.y;
    }
}