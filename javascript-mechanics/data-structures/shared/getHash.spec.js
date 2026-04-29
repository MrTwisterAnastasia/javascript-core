import { expect, test, describe } from "vitest";
import { getHash } from "./getHash";

describe("getHash", () => {
  test("returns the same hash bucket for the same key", () => {
    expect(getHash("hello", 10)).toBe(getHash("hello", 10));
  });

  test("returns a hash bucket within hash-table capacity", () => {
    const capacityOfHashTable = 100;
    const bucket = getHash(
      "some-long-key-value-sfdaidagadieoasdlfgdf",
      capacityOfHashTable,
    );
    expect(bucket).toBeGreaterThanOrEqual(0);
    expect(bucket).toBeLessThan(capacityOfHashTable);
  });

  test("returns a stable in-range bucket for an object", () => {
    const capacityOfHashTable = 100;
    const value = { id: 1 };
    const bucket = getHash(value, capacityOfHashTable);
    expect(bucket).toBeGreaterThanOrEqual(0);
    expect(bucket).toBeLessThan(capacityOfHashTable);
    expect(getHash(value, capacityOfHashTable)).toBe(bucket);
  });
});
