import {StringUtils} from "./StringUtils";

it("StringUtils.indent", () => {
    expect(StringUtils.indent("text")).toEqual("    text");
});

it("StringUtils.padStart", () => {
    expect(StringUtils.padStart("text", 5)).toEqual(" text");
    expect(StringUtils.padStart("text", 4)).toEqual("text");
    expect(StringUtils.padStart("text", 3)).toEqual("text");
});

it("StringUtils.padEnd", () => {
    expect(StringUtils.padEnd("text", 5)).toEqual("text ");
    expect(StringUtils.padEnd("text", 4)).toEqual("text");
    expect(StringUtils.padEnd("text", 3)).toEqual("text");
});