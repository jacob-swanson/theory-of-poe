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

export type SkillSpritesJson = {
    [key in SkillSpriteGroups]: SkillSpriteJson[];
};