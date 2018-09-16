import {ReactPIXISprite, ReactPIXISpriteProps} from "./ReactPIXISprite";


export enum Types {
    Sprite = 'sprite'
}

export interface ClassMap {
    [Types.Sprite]: ReactPIXISprite;
}

export interface PropertiesMap {
    [Types.Sprite]: ReactPIXISpriteProps
}


/**
 * Augment the global JSX namespace to include our custom component type map as
 * intrinsic elements.
 */
declare global {
    namespace JSX {
        interface IntrinsicElements extends PropertiesMap {}
    }
}