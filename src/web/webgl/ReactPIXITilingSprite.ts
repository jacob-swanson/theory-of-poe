import {ReactPIXIComponent} from "./ReactPIXIComponent";
import * as PIXI from "pixi.js";
import {Point} from "./ReactPIXIInternals";

export interface ReactPIXITilingSpriteProps {
    url: string;
    position?: Point;
    size?: Point
}

export class ReactPIXITilingSprite extends PIXI.extras.TilingSprite implements ReactPIXIComponent<ReactPIXITilingSpriteProps> {
    constructor(props: ReactPIXITilingSpriteProps) {
        super(PIXI.Texture.fromImage(props.url), props.size && props.size.x || undefined, props.size && props.size.y || undefined);
    }

    public update(oldProps: ReactPIXITilingSpriteProps, newProps: ReactPIXITilingSpriteProps): void {
        if (newProps.position && oldProps.position !== newProps.position) {
            this.x = newProps.position.x;
            this.y = newProps.position.y;
        }
    }
}