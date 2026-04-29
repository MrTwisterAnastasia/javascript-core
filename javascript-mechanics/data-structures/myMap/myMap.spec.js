import { expect, test, describe } from "vitest";
import { MyMap, Entry } from "./myMap";

describe("Entry", () => {
  test("stores key, value, and chain when chain is a number", () => {
    const entry = new Entry("key", "value", -1);
    expect(entry.key).toBe("key");
    expect(entry.value).toBe("value");
    expect(entry.chain).toBe(-1);
  });

  test("accepts any type for key and value", () => {
    const keyObj = { id: 1 };
    const valueArr = [1, 2, 3];
    const entry = new Entry(keyObj, valueArr, 0);
    expect(entry.key).toBe(keyObj);
    expect(entry.value).toBe(valueArr);
    expect(entry.chain).toBe(0);
  });

  test("throws when chain is NOT a number", () => {
    expect(() => new Entry("k", "v", "abc")).toThrow(
      "Chain prop should be a number",
    );
  });
});

describe("MyMap", () => {
  describe("constructor", () => {
    test("creates an empty map when no arguments are passed", () => {
      const map = new MyMap();
      expect(map.nextDataTableIndex).toBe(0);
      expect(map.size).toEqual(0);
    });

    test("ignores a non-iterable argument", () => {
      const map = new MyMap(42);
      expect([...map]).toEqual([]);
    });

    test("populates entries from an iterable of [key, value] pairs", () => {
      const map = new MyMap([
        ["a", 1],
        ["b", 2],
        ["c", 3],
      ]);
      expect(map.size).toBe(3);
    });
  });

  describe("set", () => {
    test("stores a new entry with the given key and value", () => {
      const map = new MyMap();
      map.set("a", 1);
      const bucket = map.getHashByKey("a");
      const index = map.hashTable[bucket];
      expect(map.dataTable[index].key).toBe("a");
      expect(map.dataTable[index].value).toBe(1);
    });

    test("increments size on each call", () => {
      const map = new MyMap();
      map.set("a", 1);
      map.set("b", 2);
      map.set("c", 3);
      expect(map.size).toBe(3);
    });

    test("first entry in a bucket has chain set to -1", () => {
      const map = new MyMap();
      map.set("unique-key", 1);
      expect(map.dataTable[0].chain).toBe(-1);
    });

    test("chains entries together when keys collide to the same bucket", () => {
      const map = new MyMap();
      // "ab" and "ba" have the same char-code sum and collide
      map.set("ab", 1);
      map.set("ba", 2);

      const bucket = map.getHashByKey("ab");
      const latestIndex = map.hashTable[bucket];

      // hashTable points at the most recently inserted entry in the bucket
      expect(latestIndex).toBe(1);
      // latest entry's chain points back to the previous entry's index
      expect(map.dataTable[latestIndex].chain).toBe(0);
      // first entry in the chain terminates with -1
      expect(map.dataTable[0].chain).toBe(-1);
    });

    test("updates the value in place when the same key is set twice", () => {
      const map = new MyMap();
      map.set("a", 1);
      map.set("a", 2);
      expect(map.dataTable[0].value).toBe(2);
    });

    test("does not add a new entry when updating an existing key", () => {
      const map = new MyMap();
      map.set("a", 1);
      map.set("a", 2);
      expect(map.nextDataTableIndex).toBe(1);
      expect(map.size).toBe(1);
      expect(map.dataTable[0].value).toBe(2);
    });

    test("updates the correct entry when the key is mid-chain", () => {
      const map = new MyMap();
      // "ab" is inserted first, then "ba" collides into the same bucket
      map.set("ab", 1);
      map.set("ba", 2);
      map.set("ab", 10);
      expect(map.dataTable[0].value).toBe(10);
      expect(map.dataTable[1].value).toBe(2);
      expect(map.nextDataTableIndex).toBe(2);
    });
  });

  describe("get", () => {
    test("returns undefined when the key is not present", () => {
      const map = new MyMap();
      map.set("a", 1);
      expect(map.get("missing")).toBeUndefined();
    });

    test("returns the value for a existing key", () => {
      const map = new MyMap();
      map.set("a", 1);
      expect(map.get("a")).toBe(1);
    });

    test("returns the correct value when keys collide (chain traversal)", () => {
      const map = new MyMap();
      map.set("ab", 1);
      map.set("ba", 2);
      expect(map.get("ab")).toBe(1);
      expect(map.get("ba")).toBe(2);
    });

    test("returns undefined for a key whose hash is the same as in a bucket but is not in the chain", () => {
      const map = new MyMap();
      map.set("ab", 1);
      // "ba" hashes to the same bucket but was never set
      expect(map.get("ba")).toBeUndefined();
    });
  });

  describe("has", () => {
    test("returns false when the key is not present", () => {
      const map = new MyMap();
      map.set("a", 1);
      expect(map.has("missing")).toBe(false);
    });

    test("returns true for a stored key", () => {
      const map = new MyMap();
      map.set("a", 1);
      expect(map.has("a")).toBe(true);
    });

    test("returns true for a key reached via chain traversal", () => {
      const map = new MyMap();
      map.set("ab", 1);
      map.set("ba", 2);
      expect(map.has("ab")).toBe(true);
      expect(map.has("ba")).toBe(true);
    });

    test("returns false for a key whose hash is the same as in a bucket but is not in the chain", () => {
      const map = new MyMap();
      map.set("ab", 1);
      expect(map.has("ba")).toBe(false);
    });
  });

  describe("delete", () => {
    test("return false when the key is not in the map", () => {
      const map = new MyMap();
      map.set("a", 1);
      expect(map.delete("missing")).toBe(false);
    });
    test("return true when the key is deleted from the map", () => {
      const map = new MyMap();
      map.set("a", 1);
      expect(map.delete("a")).toBe(true);
    });

    test("adjust size of map after deletion", () => {
      const map = new MyMap();
      map.set("a", 1);
      expect(map.size).toBe(1);
      map.delete("a");
      expect(map.size).toBe(0);
    });

    test("makes .get() return undefined after deletion", () => {
      const map = new MyMap();
      map.set("a", 1);
      map.delete("a");
      expect(map.get("a")).toBeUndefined();
    });

    test("makes .has() return false after deletion", () => {
      const map = new MyMap();
      map.set("a", 1);
      map.delete("a");
      expect(map.has("a")).toBe(false);
    });

    test("clears the bucket when the only entry in it is removed", () => {
      const map = new MyMap();
      map.set("a", 1);
      const bucket = map.getHashByKey("a");
      map.delete("a");
      expect(map.hashTable[bucket]).toBe(-1);
    });

    test("removes the latest entry in a chain and points the bucket at the previous entry", () => {
      const map = new MyMap();
      map.set("ab", 1);
      map.set("ba", 2);
      const bucket = map.getHashByKey("ab");
      map.delete("ba"); // "ba" is latest in the bucket
      expect(map.hashTable[bucket]).toBe(0); // now points at "ab"
      expect(map.get("ab")).toBe(1);
      expect(map.has("ba")).toBe(false);
    });

    test("removes the first-inserted entry from a chain and terminates the chain", () => {
      const map = new MyMap();
      map.set("ab", 1);
      map.set("ba", 2);
      map.delete("ab"); // "ab" is first inserted, deeper in the chain
      expect(map.has("ab")).toBe(false);
      expect(map.get("ba")).toBe(2);
      // "ba"'s chain was 0 (pointing at "ab"); after delete it should be -1
      expect(map.dataTable[1].chain).toBe(-1);
    });

    test("removes a middle entry from a chain and re-links the parent over it", () => {
      const map = new MyMap();
      // "ab", "ba", "-" all hash to bucket 45
      map.set("ab", 1);
      map.set("ba", 2);
      map.set("-", 3);
      // chain (walked from bucket): "-" (idx 2) → "ba" (idx 1) → "ab" (idx 0)
      map.delete("ba");
      // "-"'s chain should now skip "ba" and point at "ab"
      expect(map.dataTable[2].chain).toBe(0);
      expect(map.has("ba")).toBe(false);
      expect(map.get("ab")).toBe(1);
      expect(map.get("-")).toBe(3);
    });
  });

  describe("clear", () => {
    test("resets size to 0", () => {
      const map = new MyMap([
        ["a", 1],
        ["b", 2],
        ["c", 3],
      ]);
      expect(map.size).toBe(3);
      map.clear();
      expect(map.size).toBe(0);
    });

    test("empties the dataTable", () => {
      const map = new MyMap();
      map.set("a", 1);
      map.set("b", 2);
      map.clear();
      expect([...map.dataTable]).toEqual([]);
    });

    test("resets nextDataTableIndex to 0", () => {
      const map = new MyMap();
      map.set("a", 1);
      map.set("b", 2);
      map.clear();
      expect(map.nextDataTableIndex).toBe(0);
    });

    test("resets every hashTable bucket to -1", () => {
      const map = new MyMap();
      map.set("a", 1);
      map.set("ab", 2);
      map.clear();
      expect(map.hashTable.every((bucket) => bucket === -1)).toBe(true);
    });
  });

  describe("entries", () => {
    test("returns [key, value] pairs in insertion order", () => {
      const map = new MyMap();
      map.set("a", 1);
      map.set("b", 2);
      map.set("c", 3);
      expect([...map.entries()]).toEqual([
        ["a", 1],
        ["b", 2],
        ["c", 3],
      ]);
    });

    test("returns an empty array for an empty map", () => {
      const map = new MyMap();
      expect([...map.entries()]).toEqual([]);
    });

    test("skips deleted entries", () => {
      const map = new MyMap();
      map.set("a", 1);
      map.set("b", 2);
      map.set("c", 3);
      map.delete("b");
      expect([...map.entries()]).toEqual([
        ["a", 1],
        ["c", 3],
      ]);
    });

    test("reflects updated values and preserves original position", () => {
      const map = new MyMap();
      map.set("a", 1);
      map.set("b", 2);
      map.set("a", 10);
      expect([...map.entries()]).toEqual([
        ["a", 10],
        ["b", 2],
      ]);
    });

    test("walks linked list in insertion order", () => {
      const map = new MyMap();
      // "ab" and "ba" collide to the same bucket
      map.set("ab", 1);
      map.set("ba", 2);
      expect([...map.entries()]).toEqual([
        ["ab", 1],
        ["ba", 2],
      ]);
    });
  });

  describe("keys", () => {
    test("returns keys in insertion order", () => {
      const map = new MyMap();
      map.set("a", 1);
      map.set("b", 2);
      map.set("c", 3);
      expect([...map.keys()]).toEqual(["a", "b", "c"]);
    });

    test("returns an empty array for an empty map", () => {
      const map = new MyMap();
      expect([...map.keys()]).toEqual([]);
    });

    test("skips deleted keys", () => {
      const map = new MyMap();
      map.set("a", 1);
      map.set("b", 2);
      map.set("c", 3);
      map.delete("b");
      expect([...map.keys()]).toEqual(["a", "c"]);
    });

    test("does not duplicate keys when an existing key is updated", () => {
      const map = new MyMap();
      map.set("a", 1);
      map.set("a", 2);
      expect([...map.keys()]).toEqual(["a"]);
    });
  });

  describe("values", () => {
    test("returns values in insertion order", () => {
      const map = new MyMap();
      map.set("a", 1);
      map.set("b", 2);
      map.set("c", 3);
      expect([...map.values()]).toEqual([1, 2, 3]);
    });

    test("returns an empty array for an empty map", () => {
      const map = new MyMap();
      expect([...map.values()]).toEqual([]);
    });

    test("skips values of deleted entries", () => {
      const map = new MyMap();
      map.set("a", 1);
      map.set("b", 2);
      map.set("c", 3);
      map.delete("b");
      expect([...map.values()]).toEqual([1, 3]);
    });

    test("returns the latest value after an update (no duplicates)", () => {
      const map = new MyMap();
      map.set("a", 1);
      map.set("b", 2);
      map.set("a", 10);
      expect([...map.values()]).toEqual([10, 2]);
    });
  });
});
