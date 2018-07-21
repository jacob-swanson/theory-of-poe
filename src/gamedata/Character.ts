import {AllocatableNode} from "./passive-skill-tree/nodes/AllocatableNode";
import {computed, observable} from "mobx";
import {Mod} from "./modifiers/Mod";
import {MaximumLife} from "./stats/life/MaximumLife";
import {StatConstructor} from "./stats/Stat";
import {ValueStat} from "./stats/ValueStat";

export class Character {
    @observable protected modifiers: Mod[] = [];

    protected calculatedStats = [
        new MaximumLife(this)
    ];

    constructor(protected readonly nodes: AllocatableNode[] = []) {
    }

    public addModifiers(...mods: Mod[]) {
        this.modifiers.push(...mods);
    }

    @computed
    public get allocatedNodes(): AllocatableNode[] {
        return this.nodes.filter(node => node.allocated);
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
        for (const modifier of this.modifiers) {
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

    public multiplyStatByType(statTypes: Array<StatConstructor<number>>): number {
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
        const morePercent = this.multiplyStatByType(more);

        return baseValue * (1 + increasePercent / 100) * (1 + morePercent / 100);
    }
}