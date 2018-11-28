import {Character} from "../Character";
import {StatConstructor} from "./Stat";

export abstract class ComputedStat<T = number> {
    protected readonly baseType: StatConstructor<number>;
    protected readonly increasedType: StatConstructor<number> | undefined;
    protected readonly moreType: StatConstructor<number> | undefined;

    constructor(protected readonly character: Character) {
    }

    public get value(): number {
        return this.computeValue();
    }

    protected computeValue(): number {
        const baseValue = this.character.sumStatByType(this.baseType);
        const increasePercent = this.increasedType ? this.character.sumStatByType(this.increasedType) : 0;
        const morePercent = this.moreType ? this.character.multiplyStatByType(this.moreType) : 0;

        return baseValue * (1 + increasePercent / 100) * (1 + morePercent / 100);
    }
}
