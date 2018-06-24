import { GroupJson } from './GroupJson';
import { CharacterDataJson } from './CharacterDataJson';
import { RootJson } from './RootJson';
import { NodeJsonMap } from './NodeJson';
import { ExtraImagesJson } from './ExtraImagesJson';
import { SpriteSheetJson } from './SpriteSheetJson';


export interface PassiveTreeJson {
    characterData: CharacterDataJson;
    groups: {
        [key: string]: GroupJson
    };
    root: RootJson;
    nodes: NodeJsonMap;
    extraImages: {
        [key: string]: ExtraImagesJson;
    };
    min_x: number;
    min_y: number;
    max_x: number;
    max_y: number;
    assets: {
        [key: string]: {
            [key: string]: string;
        }
    };
    constants: {
        classes: {
            StrClass: number;
            DexClass: number;
            IntClass: number;
            StrDexClass: number;
            StrIntClass: number;
            DexIntClass: number;
            StrDexIntClass: number;
        };
        characterAttributes: {
            Strength: number;
            Dexterity: number;
            Intelligence: number;
        };
        PSSCentreInnerRadius: number;
        skillsPerOrbit: number[];
        orbitRadii: number[];
    };
    imageRoot: string;
    skillSprites: {
        normalActive: SpriteSheetJson[];
        notableActive: SpriteSheetJson[];
        keystoneActive: SpriteSheetJson[];
        normalInactive: SpriteSheetJson[];
        notableInactive: SpriteSheetJson[];
        keystoneInactive: SpriteSheetJson[];
        mastery: SpriteSheetJson[];
        [key: string] : SpriteSheetJson[];
    }
    imageZoomLevels: number[];
}
