import {ReactPIXISprite, ReactPIXISpriteProps} from "./ReactPIXISprite";
import {ReactPIXIContainer, ReactPIXIContainerProps} from "./ReactPIXIContainer";
import {ReactPIXILine, ReactPIXILineProps} from "./ReactPIXILine";
import {ReactPIXIArcTo, ReactPIXIArcToProps} from "./ReactPIXIArcTo";
import {ReactPIXIArc, ReactPIXIArcProps} from "./ReactPIXIArc";
import {ReactPIXITilingSprite, ReactPIXITilingSpriteProps} from "./ReactPIXITilingSprite";

export enum Types {
    Sprite = "pixi-sprite",
    Container = "pixi-container",
    Line = "pixi-line",
    ArcTo = "pixi-arc-to",
    Arc = "pixi-arc",
    TilingSprite = "pixi-tiling-sprite"
}

export interface ClassMap {
    [Types.Sprite]: ReactPIXISprite;
    [Types.Container]: ReactPIXIContainer;
    [Types.Line]: ReactPIXILine;
    [Types.ArcTo]: ReactPIXIArcTo;
    [Types.Arc]: ReactPIXIArc;
    [Types.TilingSprite]: ReactPIXITilingSprite;
}

export interface PropertiesMap {
    [Types.Sprite]: ReactPIXISpriteProps;
    [Types.Container]: ReactPIXIContainerProps;
    [Types.Line]: ReactPIXILineProps;
    [Types.ArcTo]: ReactPIXIArcToProps;
    [Types.Arc]: ReactPIXIArcProps;
    [Types.TilingSprite]: ReactPIXITilingSpriteProps;
}

export interface Point {
    x: number;
    y: number;
}

export interface Rectangle extends Point {
    width: number;
    height: number;
}

export interface BoundRectangle {
    left: number;
    top: number;
    right: number;
    bottom: number;
}

/**
 * Augment the global JSX namespace to include our custom component type map as
 * intrinsic elements.
 */
declare global {
    namespace JSX {
        interface IntrinsicElements extends PropertiesMap {
        }
    }
}