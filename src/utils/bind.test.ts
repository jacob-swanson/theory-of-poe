import {bind} from "./bind";

describe("@bind", () => {
    it("method decorator", () => {
        class Test {
            public value: string = "";

            @bind
            public setText(value: string): void {
                this.value = value;
            }
        }

        const test = new Test();
        expect(test.value).toBe("");

        test.setText("test1");
        expect(test.value).toBe("test1");

        const {setText} = test;
        setText("test2");
        expect(test.value).toBe("test2");
    });
});