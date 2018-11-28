export function bind<T extends () => any>(
    target: any,
    propertyKey: string,
    descriptor: TypedPropertyDescriptor<Function>
): TypedPropertyDescriptor<T> {
    const method: Function | undefined = descriptor.value;
    if (typeof method !== "function") {
        throw new Error(`Property ${propertyKey} is not a method and cannot be used with @bind`);
    }

    return {
        configurable: true,
        get(this: T): T {
            const boundMethod: T = descriptor.value!.bind(this);
            Object.defineProperty(this, propertyKey, {
                value: boundMethod,
                configurable: true,
                writable: true
            });
            return boundMethod;
        }
    };
}