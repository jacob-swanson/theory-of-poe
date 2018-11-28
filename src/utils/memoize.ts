export function memoize(
    target: any,
    propKey: string,
    descriptor: TypedPropertyDescriptor<any>
) {
    if (descriptor.value && typeof descriptor.value === "function") {
        descriptor.value = createMemoizeFunction(descriptor.value, propKey);
    } else if (descriptor.get && typeof descriptor.get === "function") {
        descriptor.get = createMemoizeFunction(descriptor.get, propKey);
    } else {
        throw new Error("@memoize only supports methods and get accessors")
    }
}

function createMemoizeFunction(method: Function, propKey: string) {
    return function (this: object) {
        const propName = `__@memoize_${propKey}`;
        if (this.hasOwnProperty(propName)) {
            return this[propName];
        } else {
            const value = method.apply(this, arguments);
            Object.defineProperty(
                this,
                propName,
                {
                    value
                }
            );
            return value;
        }
    };
}