export interface Stat<T> {
    readonly value: T;
}

export interface StatConstructor<T> {
    new(...args: any[]): Stat<T>;
}
