import {GroupResponse} from "./GroupResponse";
import {ClassArtResponse} from "./ClassArtResponse";
import {Dictionary} from "../../../utils/Dictionary";

export interface PassiveTreeResponse {
    version: string;
    groups: GroupResponse[];
    classArt: ClassArtResponse[];
    skillsPerOrbit: number[];
    orbitRadii: number[];
    assets: Dictionary<string>;
    skillSprites: Dictionary<string>;
}