import {GroupJson} from "./GroupJson";
import {CharacterDataJson} from "./CharacterDataJson";
import {RootJson} from "./RootJson";
import {NodeJson} from "./NodeJson";
import {ExtraImagesJson} from "./ExtraImagesJson";
import {Dictionary} from "../../../utils/Dictionary";
import {SkillSpritesJson} from "./SkillSpritesJson";

export interface PassiveTreeConstantsJson {
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
}

export interface PassiveTreeJson {
    characterData: Dictionary<CharacterDataJson>;
    groups: Dictionary<GroupJson>;
    root: RootJson;
    nodes: Dictionary<NodeJson>;
    extraImages: Dictionary<ExtraImagesJson>;
    min_x: number;
    min_y: number;
    max_x: number;
    max_y: number;
    assets: Dictionary<Dictionary<string>>;
    constants: PassiveTreeConstantsJson;
    imageRoot: string;
    skillSprites: SkillSpritesJson;
    imageZoomLevels: number[];
}
