export interface Cache<T = any> {
    has(key: string): boolean;

    get(key: string): T | undefined;

    getOrDefault(key: string, value: T): T;

    getOrProvide(key: string, provider: () => T): T

    set(key: string, value: T): T;
}

export abstract class AbstractCache<T> implements Cache<T> {
    public getOrDefault(key: string, value: T): T {
        const hasKey = this.has(key);
        if (hasKey) {
            return this.get(key)!!;
        } else {
            this.set(key, value);
            return value;
        }
    }

    public getOrProvide(key: string, provider: () => T): T {
        const hasKey = this.has(key);
        if (hasKey) {
            return this.get(key)!!;
        } else {
            const value = provider();
            this.set(key, value);
            return value;
        }
    }

    public abstract get(key: string): T | undefined;

    public abstract has(key: string): boolean;

    public abstract set(key: string, value: T): T;

}