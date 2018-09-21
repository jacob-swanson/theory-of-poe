import {GroupState} from "./GroupState";
import {SkillSpritesJson} from "../../../gamedata/passive-skill-tree/external-data/SkillSpritesJson";

export class PassiveTreeState {
    public groups: Map<string, GroupState>;

    constructor(
        public readonly orbitRadii: number[],
        public readonly skillsPerOrbit: number[],
        public readonly skillSprites: SkillSpritesJson
    ) {
    }
}