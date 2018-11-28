import {memoize} from "./memoize";

describe("@memoize", () => {
    it("method", () => {
        class Test {
            private callCount = 0;

            @memoize
            public getCallCount(): number {
                return ++this.callCount;
            }
        }

        const test = new Test();
        expect(test.getCallCount()).toBe(1);
        expect(test.getCallCount()).toBe(1);
    });

    it("accessor", () => {
        class Test {
            private callCount = 0;

            @memoize
            public get callcount(): number {
                return ++this.callCount;
            }
        }

        const test = new Test();
        expect(test.callcount).toBe(1);
        expect(test.callcount).toBe(1);
    });
});