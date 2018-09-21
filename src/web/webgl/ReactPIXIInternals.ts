import {ReactPIXISprite, ReactPIXISpriteProps} from "./ReactPIXISprite";
import {ReactPIXIContainer, ReactPIXIContainerProps} from "./ReactPIXIContainer";

export enum Types {
    Sprite = "pixi-sprite",
    Container = "pixi-container"
}

export interface ClassMap {
    [Types.Sprite]: ReactPIXISprite;
    [Types.Container]: ReactPIXIContainer;
}

export interface PropertiesMap {
    [Types.Sprite]: ReactPIXISpriteProps
    [Types.Container]: ReactPIXIContainerProps
}

export interface Point {
    x: number;
    y: number;
}

export interface Rectangle extends Point {
    width: number;
    height: number;
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