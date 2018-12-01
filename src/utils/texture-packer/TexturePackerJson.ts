// example: https://github.com/kittykatattack/learningPixi/blob/master/examples/images/animals.json

import {Dictionary} from "../Dictionary";

export interface TexturePackerFrame {
    frame: { x: number; y: number; w: number; h: number };
}

export interface TexturePackerJson {
    frames: Dictionary<TexturePackerFrame>;
    meta: {
        image: string;
    };
}