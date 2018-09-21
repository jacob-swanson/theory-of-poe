export interface ReactPIXIComponent<T extends {} = {}> {
    update(oldProps: T, newProps: T): void;
}