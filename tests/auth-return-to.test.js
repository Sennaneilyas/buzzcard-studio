import { describe, expect, it } from "vitest";
import { getSafeReturnTo } from "../src/features/auth/utils/returnTo";

describe("authentication return routes", () => {
  it.each([
    ["/checkout", "/checkout"],
    ["/products/classique?color=black#preview", "/products/classique?color=black#preview"],
  ])("accepts an internal route", (input, expected) => {
    expect(getSafeReturnTo(input)).toBe(expected);
  });

  it.each([
    [null],
    ["https://example.com"],
    ["//example.com"],
    ["/\\example.com"],
    ["checkout"],
  ])("rejects an unsafe return route", (input) => {
    expect(getSafeReturnTo(input)).toBe("/onboarding");
  });
});
