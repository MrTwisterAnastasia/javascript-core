import { expect, test, describe } from "vitest";
import { MySet, SetEntity } from "./mySet";

describe("SetEntity", () => {
  test("stores value and chain when chain is a number", () => {
    const entity = new SetEntity("value", -1);
    expect(entity.value).toBe("value");
    expect(entity.chain).toBe(-1);
  });

  test("throws when chain is NOT a number", () => {
    expect(() => new SetEntity("v", "abc")).toThrow(
      "Chain prop should be a number",
    );
  });
});

describe("MySet", () => {
  describe("constructor", () => {
    test("creates an empty set when no arguments are passed", () => {
      const set = new MySet();
      expect(set.size).toBe(0);
    });

    test("fills empty buckets with -1", () => {
      const set = new MySet();
      expect(set.hashTable.every((bucket) => bucket === -1)).toBe(true);
    });

    test("ignores a non-iterable argument", () => {
      const set = new MySet(42);
      expect(set.nextDataTableIndex).toBe(0);
      expect([...set.dataTable]).toEqual([]);
    });

    test("populates entitys from an iterable of values", () => {
      const set = new MySet([1, 2, 3]);
      expect(set.nextDataTableIndex).toBe(3);
      expect(set.size).toBe(3);
    });

    test("skips duplicates in the iterable (matches real Set)", () => {
      const mySet = new MySet([1, 2, 2, 3, 3, 3]);
      const realSet = new Set([1, 2, 2, 3, 3, 3]);
      expect(mySet.size).toBe(realSet.size);
    });
  });

  describe("add", () => {
    test("stores a new entity with the given value", () => {
      const set = new MySet();
      set.add("a");
      const bucket = set.getHashByValue("a");
      const index = set.hashTable[bucket];
      expect(set.dataTable[index].value).toBe("a");
    });

    test("does not add a new entity when the value is already in the set", () => {
      const set = new MySet();
      const obj = { a: 1 };
      set.add(obj);
      set.add(obj);
      expect(set.nextDataTableIndex).toBe(1);
      expect(set.size).toBe(1);
    });

    test("first entity in a bucket has chain set to -1", () => {
      const set = new MySet();
      set.add("unique-value");
      expect(set.dataTable[0].chain).toBe(-1);
    });

    test("chains entitys when values collide to the same bucket", () => {
      const set = new MySet();
      // "ab" and "ba" have the same char-code sum and collide
      set.add("ab");
      set.add("ba");

      const bucket = set.getHashByValue("ab");
      const latestIndex = set.hashTable[bucket];

      // hashTable points at the most recently inserted entity in the bucket
      expect(latestIndex).toBe(1);
      // latest entity's chain points back to the previous entity's index
      expect(set.dataTable[latestIndex].chain).toBe(0);
      // first entity in the chain terminates with -1
      expect(set.dataTable[0].chain).toBe(-1);
    });
  });

  describe("has", () => {
    test("returns false when the value is not present", () => {
      const set = new MySet();
      set.add("a");
      expect(set.has("missing")).toBe(false);
    });

    test("returns true for a stored value", () => {
      const set = new MySet();
      set.add("a");
      expect(set.has("a")).toBe(true);
    });

    test("returns true for a value reached via chain traversal", () => {
      const set = new MySet();
      set.add("ab");
      set.add("ba");
      expect(set.has("ab")).toBe(true);
      expect(set.has("ba")).toBe(true);
    });

    test("returns false for a value whose hash matches a bucket but is not in the chain", () => {
      const set = new MySet();
      set.add("ab");
      // "ba" hashes to the same bucket but was never added
      expect(set.has("ba")).toBe(false);
    });
  });

  describe("clear", () => {
    test("empties the dataTable", () => {
      const set = new MySet([1, 2, 3]);
      set.clear();
      expect([...set.dataTable]).toEqual([]);
    });

    test("resets nextDataTableIndex to 0", () => {
      const set = new MySet([1, 2, 3]);
      set.clear();
      expect(set.nextDataTableIndex).toBe(0);
    });

    test("resets every hashTable bucket to -1", () => {
      const set = new MySet(["a", "ab"]);
      set.clear();
      expect(set.hashTable.every((bucket) => bucket === -1)).toBe(true);
    });

    test("after clear, has() returns false for previously added values", () => {
      const set = new MySet(["a", "b"]);
      set.clear();
      expect(set.has("a")).toBe(false);
      expect(set.has("b")).toBe(false);
    });
  });

  describe("delete", () => {
    test("returns false when the value is not in the set", () => {
      const set = new MySet(["a"]);
      expect(set.delete("missing")).toBe(false);
    });

    test("returns true when the value is deleted", () => {
      const realSet = new Set(["a"]);
      expect(realSet.delete("a")).toBe(true);

      const mySet = new MySet(["a"]);
      expect(mySet.delete("a")).toBe(true);
    });

    test("makes .has() return false after deletion", () => {
      const set = new MySet(["a"]);
      set.delete("a");
      expect(set.has("a")).toBe(false);
    });
  });

  describe("parity with real Set", () => {
    test("treats NaN as equal to NaN (SameValueZero semantics)", () => {
      // Real Set considers NaN equal to NaN for membership purposes
      expect(new Set([NaN]).has(NaN)).toBe(true);

      const mySet = new MySet([NaN]);
      expect(mySet.has(NaN)).toBe(true);
    });

    test("does not add NaN twice (SameValueZero semantics)", () => {
      const realSet = new Set();
      realSet.add(NaN);
      realSet.add(NaN);
      expect(realSet.size).toBe(1);

      const mySet = new MySet();
      mySet.add(NaN);
      mySet.add(NaN);
      expect(mySet.nextDataTableIndex).toBe(1);
    });

    test("treats +0 and -0 as the same value", () => {
      expect(new Set([+0]).has(-0)).toBe(true);

      const mySet = new MySet([+0]);
      expect(mySet.has(-0)).toBe(true);
    });

    test("distinguishes different object references", () => {
      const a = { id: 1 };
      const b = { id: 1 };
      const realSet = new Set([a, b]);
      expect(realSet.size).toBe(2);

      const mySet = new MySet([a, b]);
      expect(mySet.nextDataTableIndex).toBe(2);
      expect(mySet.has(a)).toBe(true);
      expect(mySet.has(b)).toBe(true);
    });

    test("does not add the same object reference twice", () => {
      const obj = { id: 1 };
      const realSet = new Set();
      realSet.add(obj);
      realSet.add(obj);
      expect(realSet.size).toBe(1);

      const mySet = new MySet();
      mySet.add(obj);
      mySet.add(obj);
      expect(mySet.nextDataTableIndex).toBe(1);
    });

    test("membership stays in sync with real Set", () => {
      const values = ["a", "b", "ab", "ba", 1, "1", NaN];
      const realSet = new Set(values);
      const mySet = new MySet(values);

      for (const v of values) {
        expect(mySet.has(v)).toBe(realSet.has(v));
      }
      expect(mySet.has("missing")).toBe(realSet.has("missing"));
    });
  });
});
