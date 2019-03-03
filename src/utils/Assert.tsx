export class Assert {
    /**
     * Assert that a value is not null.
     *
     * @param value the value to check
     * @param message the message for the error
     */
    public static notNull<T>(value: T | null | undefined, message?: string): T {
        if (value === null || value === undefined) {
            throw new Error(message || "value is required");
        }
        return value;
    }
}