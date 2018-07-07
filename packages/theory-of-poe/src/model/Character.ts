import {AllocatableNode} from "./nodes/AllocatableNode";
import {computed, observable} from "mobx";
import {ValueMod} from "./stats/ValueMod";

export class Character {
    @observable stats: ValueMod[] = [];

    constructor(protected readonly nodes: AllocatableNode[] = []) {
    }

    @computed
    public get allocatedNodes(): AllocatableNode[] {
        return this.nodes.filter(node => node.allocated);
    }

    public sumStatByType(statType: Function): number {
        let sum = 0;
        for (const stat of this.stats) {
            if (stat instanceof statType) {
                sum += stat.value;
            }
        }
        return sum;
    }

    public multiplyStatByType(statType: Function): number {
        let product = 1;
        for (const stat of this.stats) {
            if (stat instanceof statType) {
                product *= stat.value;
            }
        }
        return product;
    }
}