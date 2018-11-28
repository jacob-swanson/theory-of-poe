import {AbstractCache, Cache} from "./Cache";

export class LRUCache<T> extends AbstractCache<T> {
    private values: Map<string,T> = new Map<string, T>();

    constructor(private readonly capacity: number = 100) {
        super();
    }

    public get(key: string): T | undefined {
        if (!this.has(key)) {
            return undefined;
        }

        const value = this.values.get(key)!;
        this.values.delete(key);
        this.values.set(key, value);

        return value;
    }

    public has(key: string): boolean {
        return this.values.has(key);
    }

    public set(key: string, value: T): T {
        if (this.values.size > this.capacity) {
            const lruKey = this.values.keys().next().value;
            this.values.delete(lruKey);
        }
        this.values.set(key, value);
        return value;
    }
}