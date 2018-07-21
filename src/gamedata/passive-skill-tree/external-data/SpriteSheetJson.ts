export interface SpriteSheetJson {
    filename: string;
    coords: {
        [key: string]: {
            x: number;
            y: number;
            w: number;
            h: number;
        }
    };
}
