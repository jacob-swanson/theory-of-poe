import {PassiveTreeJson} from "./PassiveTreeJson";

export interface PassiveSkillTreeOptionsJson {
    passiveSkillTreeData: PassiveTreeJson;
    ascClasses: {
        [key: string]: {
            name: string;
            classes: {
                [key: string]: {
                    name: string;
                    displayName: string
                    flavourText: string
                    flavourTextRect: string
                    flavourTextColor: string
                }
            }
        }
    },
    zoomLevels: number[];
    startClass: number;
    version: string;
}