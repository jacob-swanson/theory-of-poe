import {ReactPIXIComponent} from "./ReactPIXIComponent";
import * as PIXI from "pixi.js";
import {Rectangle, Point} from "./ReactPIXIInternals";

export interface ReactPIXISpriteProps {
    url?: string;
    position?: Point;
    scale?: Point;
    anchor?: Point;
    frame?: Rectangle
    key?: string;
}

export class ReactPIXISprite extends PIXI.Sprite implements ReactPIXIComponent<ReactPIXISpriteProps> {
    public type: "ReactPIXIComponent";

    private setTextureFrame = (frame: Rectangle) => {
        if (!this.texture) {
            return;
        }

        if (this.texture.width > 1 && this.texture.height > 1) {
            this.texture.frame = new PIXI.Rectangle(
                frame.x,
                frame.y,
                frame.width,
                frame.height
            );
        } else {
            this.texture.on("update", texture => {
                texture.frame = new PIXI.Rectangle(
                    frame.x,
                    frame.y,
                    frame.width,
                    frame.height
                );
            });
        }
    };

    constructor(texture?: PIXI.Texture) {
        super(texture);
    }

    public update(oldProps: ReactPIXISpriteProps, newProps: ReactPIXISpriteProps): void {
        if (newProps.url && oldProps.url !== newProps.url) {
            this.texture = PIXI.Texture.fromImage(newProps.url);
            if (newProps.frame) {
                this.texture = this.texture.clone();
            }
        }

        if (newProps.frame && oldProps.frame !== newProps.frame) {
            this.setTextureFrame(newProps.frame);
        }

        if (newProps.position && oldProps.position !== newProps.position) {
            this.position = new PIXI.Point(newProps.position.x, newProps.position.y);
        }

        if (newProps.scale && oldProps.scale !== newProps.scale) {
            this.scale = new PIXI.Point(newProps.scale.x, newProps.scale.y);
        }

        if (newProps.anchor && oldProps.anchor !== newProps.anchor) {
            this.anchor = new PIXI.ObservablePoint(
                () => {
                },
                {},
                newProps.anchor.x,
                newProps.anchor.y
            );
        }
    }
}