import {GroupState} from "./GroupState";
import {SkillSpritesJson} from "../../../gamedata/passive-skill-tree/external-data/SkillSpritesJson";
import {NodeState} from "./NodeState";
import {CharacterState} from "./CharacterState";
import {computed} from "mobx";

export class PassiveTreeState {
    public groups: Map<string, GroupState>;
    public character: CharacterState;

    constructor(
        public readonly orbitRadii: number[],
        public readonly skillsPerOrbit: number[],
        public readonly skillSprites: SkillSpritesJson
    ) {
    }

    public get nodes(): NodeState[] {
        const nodes = [];
        for (const group of this.groups.values()) {
            nodes.push(...group.nodes);
        }
        return nodes;
    }

    @computed get groupsList(): GroupState[] {
        const groups = [];
        for (const group of this.groups.values()) {
            groups.push(group);
        }
        return groups;
    }
}