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

export type SkillSpriteGroups = 'keystoneActive' |
    'keystoneInactive' |
    'mastery' |
    'normalActive' |
    'normalInactive' |
    'notableActive' |
    'notableInactive'

export interface SkillSpritesJson {
    keystoneActive: SkillSpriteJson[];
    keystoneInactive: SkillSpriteJson[];
    mastery: SkillSpriteJson[];
    normalActive: SkillSpriteJson[];
    normalInactive: SkillSpriteJson[];
    notableActive: SkillSpriteJson[];
    notableInactive: SkillSpriteJson[];
}