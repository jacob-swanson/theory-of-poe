export interface ReactPIXIComponent<T extends {} = {}> {
    type: "ReactPIXIComponent";

    update(oldProps: T, newProps: T): void;
}