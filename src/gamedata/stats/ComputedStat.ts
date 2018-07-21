import {Character} from "../Character";

export abstract class ComputedStat<T = number> {
    constructor(protected readonly character: Character) {
    }

    public abstract get value(): T;
}
