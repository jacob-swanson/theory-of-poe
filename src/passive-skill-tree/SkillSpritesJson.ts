export interface SkillSpriteFrameJson {
    x: number;
    y: number;
    w: number;
    h: number;
}

export interface SkillSpriteJson {
    filename: string;
    coords: {
        [key: string]: SkillSpriteFrameJson
    };
}

export enum SkillSpriteGroups {
    keystoneActive = "keystoneActive",
    keystoneInactive = "keystoneInactive",
    mastery = "mastery",
    normalActive = "normalActive",
    normalInactive = "normalInactive",
    notableActive = "notableActive",
    notableInactive = "notableInactive"
}

export interface SkillSpritesJson {
    keystoneActive: SkillSpriteJson[];
    keystoneInactive: SkillSpriteJson[];
    mastery: SkillSpriteJson[];
    normalActive: SkillSpriteJson[];
    normalInactive: SkillSpriteJson[];
    notableActive: SkillSpriteJson[];
    notableInactive: SkillSpriteJson[];
}