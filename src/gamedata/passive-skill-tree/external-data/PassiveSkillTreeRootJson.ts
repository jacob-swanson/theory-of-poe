import {PassiveTreeJson} from "./PassiveTreeJson";
import {Dictionary} from "../../../utils/Dictionary";

export interface AscendancyClassDetailsJson {
    name: string;
    displayName: string;
    flavourText: string;
    flavourTextRect: string;
    flavourTextColor: string;
}

export interface AscendancyClassJson {
    name: string;
    classes: Dictionary<AscendancyClassDetailsJson>;
}

export interface PassiveSkillTreeRootJson {
    passiveSkillTreeData: PassiveTreeJson;
    ascClasses: Dictionary<AscendancyClassJson>;
    zoomLevels: number[];
    startClass: number;
    version: string;
}