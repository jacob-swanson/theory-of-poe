export interface ReactPIXIComponent<T = {}> {
    type: 'ReactPIXIComponent';
    update(oldProps: T, newProps: T): void;
}