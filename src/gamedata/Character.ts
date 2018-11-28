import {PassiveTree} from "./PassiveTree";
import {action, observable} from "mobx";
import {Mod} from "./modifiers/Mod";
import {AddedDexterity} from "./modifiers/attributes/AddedDexterity";
import {AddedStrength} from "./modifiers/attributes/AddedStrength";
import {AddedIntelligence} from "./modifiers/attributes/AddedIntelligence";
import {StatConstructor} from "./stats/Stat";
import {ValueStat} from "./stats/ValueStat";
import {Dictionary} from "../utils/Dictionary";

export enum CharacterClass {
    Witch = "Witch",
    Shadow = "Shadow",
    Ranger = "Ranger",
    Duelist = "Duelist",
    Marauder = "Marauder",
    Templar = "Templar",
    Scion = "Scion"
}

export enum Ascendancy {
    Slayer = "Slayer",
    Gladiator = "Gladiator",
    Champion = "Champion",
    Assassin = "Assassin",
    Saboteur = "Saboteur",
    Trickster = "Trickster",
    Juggernaut = "Juggernaut",
    Berserker = "Berserker",
    Chieftain = "Chieftain",
    Necromancer = "Necromancer",
    Elementalist = "Elementalist",
    Occultist = "Occultist",
    Deadeye = "Deadeye",
    Raider = "Raider",
    Pathfinder = "Pathfinder",
    Inquisitor = "Inquisitor",
    Hierophant = "Hierophant",
    Guardian = "Guardian",
    Ascendant = "Ascendant"
}

export const CharacterClassesBySpc: CharacterClass[] = [
    CharacterClass.Witch,
    CharacterClass.Shadow,
    CharacterClass.Ranger,
    CharacterClass.Duelist,
    CharacterClass.Marauder,
    CharacterClass.Templar,
    CharacterClass.Scion
];

export const AscendanciesByClass: Dictionary<Ascendancy[]> = {
    [CharacterClass.Duelist]: [
        Ascendancy.Slayer,
        Ascendancy.Gladiator,
        Ascendancy.Champion
    ],
    [CharacterClass.Shadow]: [
        Ascendancy.Assassin,
        Ascendancy.Saboteur,
        Ascendancy.Trickster
    ],
    [CharacterClass.Marauder]: [
        Ascendancy.Juggernaut,
        Ascendancy.Berserker,
        Ascendancy.Chieftain
    ],
    [CharacterClass.Witch]: [
        Ascendancy.Necromancer,
        Ascendancy.Elementalist,
        Ascendancy.Occultist
    ],
    [CharacterClass.Ranger]: [
        Ascendancy.Deadeye,
        Ascendancy.Raider,
        Ascendancy.Pathfinder
    ],
    [CharacterClass.Templar]: [
        Ascendancy.Inquisitor,
        Ascendancy.Hierophant,
        Ascendancy.Guardian
    ],
    [CharacterClass.Scion]: [
        Ascendancy.Ascendant
    ]
};

export class Character {
    @observable
    public className: CharacterClass = CharacterClass.Scion;

    @observable
    public ascendancyName: Ascendancy = Ascendancy.Ascendant;

    public characterMods: Mod[] = [
        new AddedStrength(10),
        new AddedDexterity(10),
        new AddedIntelligence(10)
    ];

    constructor(public readonly passiveTree: PassiveTree) {
        passiveTree.character = this;
    }

    public get mods(): Mod[] {
        const mods = [];
        mods.push(...this.characterMods);
        this.passiveTree.allocatedNodes.map(node => node.mods).forEach(mods => mods.push(...mods));
        return mods;
    }

    public hasStat(statType: StatConstructor<boolean>): boolean {
        for (const stat of this.stats()) {
            if (stat instanceof statType) {
                return stat.value;
            }
        }
        return false;
    }

    public* stats(): IterableIterator<ValueStat<any>> {
        for (const modifier of this.mods) {
            for (const stat of modifier.stats) {
                yield stat;
            }
        }
    }

    public sumStatByType(...statTypes: Array<StatConstructor<number>>): number {
        let sum = 0;
        for (const stat of this.stats()) {
            for (const statType of statTypes) {
                if (stat instanceof statType) {
                    sum += stat.value;
                }
            }
        }
        return sum;
    }

    public multiplyStatByType(...statTypes: Array<StatConstructor<number>>): number {
        let product = null;
        for (const stat of this.stats()) {
            for (const statType of statTypes) {
                if (stat instanceof statType) {
                    product = product === null ? stat.value : product * stat.value;
                }
            }
        }
        return product === null ? 0 : product;
    }

    public calculateStat(base: StatConstructor<number> | Array<StatConstructor<number>>, increase: StatConstructor<number> | Array<StatConstructor<number>> = [], more: StatConstructor<number> | Array<StatConstructor<number>> = []) {
        if (!(base instanceof Array)) {
            base = [base];
        }
        if (!(increase instanceof Array)) {
            increase = [increase];
        }
        if (!(more instanceof Array)) {
            more = [more];
        }

        const baseValue = this.sumStatByType(...base);
        const increasePercent = this.sumStatByType(...increase);
        const morePercent = this.multiplyStatByType(...more);

        return baseValue * (1 + increasePercent / 100) * (1 + morePercent / 100);
    }

    /**
     * Set the character's class.
     *
     * @param className
     */
    @action
    public setClass(className: CharacterClass) {
        if (this.className !== className) {
            this.className = className;
            this.setAscendancy(AscendanciesByClass[className][0]);
        }
    }

    /**
     * Set the character's ascendancy.
     *
     * @param ascendancyName
     */
    @action
    public setAscendancy(ascendancyName: Ascendancy): void {
        if (this.ascendancyName !== ascendancyName) {
            this.ascendancyName = ascendancyName;
            for (const node of this.passiveTree.allocatedAscendancyNodes) {
                node.toggleAllocation();
            }
        }
    }
}