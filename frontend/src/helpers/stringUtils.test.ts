import { toTitleCase } from "./stringUtils";

describe("toTitleCase", () => {
  it.each([
    ["IN_PROGRESS", "In Progress"],
    ["hello world", "Hello World"],
    ["mIxEd cAsE", "Mixed Case"],
    ["already Title", "Already Title"],
    ["single", "Single"],
    ["__leading_and__double__", "Leading And Double"],
    ["  extra   spaces  ", "Extra Spaces"],
    ["", ""],
  ])("%j -> %j", (input, expected) => {
    expect(toTitleCase(input)).toBe(expected);
  });
});
