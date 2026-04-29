import { expect, test, describe } from "vitest";
import { MyArray } from "./myArray";

describe("MyArray", () => {
  describe("constructor", () => {
    test("creates an empty array when no arguments are passed", () => {
      const arr = new MyArray();
      expect(arr.length).toBe(0);
    });

    test("creates an array with the numeric elements", () => {
      const arr = new MyArray(1, 2, 3);
      expect(arr.length).toBe(3);
      expect(arr.at(0)).toBe(1);
      expect(arr.at(1)).toBe(2);
      expect(arr.at(2)).toBe(3);
    });

    test("creates an array with mixed element types", () => {
      const obj = { a: 1 };
      const arr = new MyArray(1, "two", obj, null, undefined, true);
      expect(arr.length).toBe(6);
      expect(arr.at(0)).toBe(1);
      expect(arr.at(1)).toBe("two");
      expect(arr.at(2)).toBe(obj);
      expect(arr.at(3)).toBeNull();
      expect(arr.at(4)).toBeUndefined();
      expect(arr.at(5)).toBe(true);
    });

    test("new MyArray(3) creates a length-3 array", () => {
      const arr = new MyArray(3);
      expect(arr.length).toBe(3);
      expect(arr[0]).toBeUndefined();
    });
  });

  describe("length", () => {
    test("returns 0 for an empty array", () => {
      expect(new MyArray().length).toBe(0);
    });

    test("returns the amount of elements", () => {
      expect(new MyArray("a", "b", "c", "d", "e").length).toBe(5);
    });

    test("updates after push and pop", () => {
      const arr = new MyArray(1);
      expect(arr.length).toBe(1);
      arr.push(2);
      expect(arr.length).toBe(2);
      arr.pop();
      expect(arr.length).toBe(1);
    });
  });

  describe("push", () => {
    test("adds an element to the end of the array", () => {
      const arr = new MyArray(1, 2);
      arr.push(3);
      expect(arr.at(2)).toBe(3);
    });

    test("works on an empty array", () => {
      const arr = new MyArray();
      expect(arr.push("a")).toBe(1);
    });
  });

  describe("pop", () => {
    test("removes and returns the last element", () => {
      const arr = new MyArray(1, 2, 3);
      expect(arr.pop()).toBe(3);
      expect(arr.length).toBe(2);
    });

    test("returns undefined when the array is empty", () => {
      expect(new MyArray().pop()).toBeUndefined();
    });
  });

  describe("at", () => {
    test("returns the element at the given positive index", () => {
      const arr = new MyArray("a", "b", "c");
      expect(arr.at(0)).toBe("a");
      expect(arr.at(1)).toBe("b");
      expect(arr.at(2)).toBe("c");
    });

    test("returns the element at a negative index counting from the end", () => {
      const arr = new MyArray("a", "b", "c");
      expect(arr.at(-1)).toBe("c");
      expect(arr.at(-2)).toBe("b");
      expect(arr.at(-3)).toBe("a");
    });

    test("returns undefined for an out-of-range index", () => {
      const arr = new MyArray("a", "b", "c");
      expect(arr.at(10)).toBeUndefined();
      expect(arr.at(-10)).toBeUndefined();
    });
  });

  describe("find", () => {
    test("returns the first element that satisfies the predicate", () => {
      const arr = new MyArray(1, 2, 3, 4);
      expect(arr.find((x) => x > 2)).toBe(3);
    });

    test("returns undefined when no element satisfies the predicate", () => {
      const arr = new MyArray(1, 2, 3);
      expect(arr.find((x) => x > 100)).toBeUndefined();
    });

    test("returns undefined when called on an empty array", () => {
      const arr = new MyArray();
      expect(arr.find(() => true)).toBeUndefined();
    });

    test("can locate objects by property", () => {
      const users = new MyArray(
        { id: 1, name: "Ann" },
        { id: 2, name: "Bob" },
        { id: 3, name: "Cat" },
      );
      expect(users.find((u) => u.name === "Bob")).toEqual({
        id: 2,
        name: "Bob",
      });
    });
  });

  describe("map", () => {
    test("returns a new MyArray with the callback applied to each element", () => {
      const arr = new MyArray(1, 2, 3);
      const result = arr.map((x) => x * 2);
      expect(result).toBeInstanceOf(MyArray);
      expect(result).not.toBe(arr);
      expect(result.length).toBe(3);
      expect(result.at(0)).toBe(2);
      expect(result.at(1)).toBe(4);
      expect(result.at(2)).toBe(6);
    });

    test("does NOT mutate the original array", () => {
      const arr = new MyArray(1, 2, 3);
      arr.map((x) => x * 10);
      expect(arr.at(0)).toBe(1);
      expect(arr.at(1)).toBe(2);
      expect(arr.at(2)).toBe(3);
      expect(arr.length).toBe(3);
    });
  });

  describe("filter", () => {
    test("returns a new MyArray with only elements that pass the predicate", () => {
      const arr = new MyArray(1, 2, 3, 4, 5);
      const result = arr.filter((x) => x % 2 === 0);
      expect(result).toBeInstanceOf(MyArray);
      expect(result.length).toBe(2);
      expect(result.at(0)).toBe(2);
      expect(result.at(1)).toBe(4);
    });

    test("does NOT mutate the original array", () => {
      const arr = new MyArray(1, 2, 3);
      arr.filter((x) => x > 1);
      expect(arr.length).toBe(3);
      expect(arr.at(0)).toBe(1);
    });

    test("returns empty MyArray with no matches (no elements pushed)", () => {
      const arr = new MyArray(1, 2, 3);
      const result = arr.filter((x) => x > 100);
      expect(result.length === 0).toBe(true);
    });
  });

  describe("reduce", () => {
    test("sums numbers without an initial value", () => {
      const arr = new MyArray(1, 2, 3, 4);
      const result = arr.reduce((acc, x) => acc + x);
      expect(result).toBe(10);
    });

    test("sums numbers using an initial value of 1", () => {
      const arr = new MyArray(1, 2, 3, 4);
      const result = arr.reduce((acc, x) => acc + x, 1);
      expect(result).toBe(11);
    });

    test("concatenates strings using an initial empty string", () => {
      const arr = new MyArray("a", "b", "c");
      const result = arr.reduce((acc, x) => acc + x, "");
      expect(result).toBe("abc");
    });
  });

  describe("bracket access by Proxy", () => {
    test("reads elements by numeric index", () => {
      const arr = new MyArray("a", "b", "c");
      expect(arr[0]).toBe("a");
      expect(arr[1]).toBe("b");
      expect(arr[2]).toBe("c");
    });

    test("returns undefined for an out-of-range index", () => {
      const arr = new MyArray(1, 2);
      expect(arr[5]).toBeUndefined();
      expect(arr[0]).toBe(1);
    });

    test("methods remain callable on the proxy", () => {
      const arr = new MyArray(1, 2, 3);
      expect(typeof arr.push).toBe("function");
      expect(typeof arr.map).toBe("function");
      expect(typeof arr.filter).toBe("function");
      expect(typeof arr.reduce).toBe("function");
      expect(arr.map((x) => x * 2).at(0)).toBe(2);
    });

    test("length getter still works through the proxy", () => {
      const arr = new MyArray("a", "b");
      expect(arr.length).toBe(2);
      arr.push("c");
      expect(arr.length).toBe(3);
    });

    test("non-numeric string keys do NOT read from _myArray", () => {
      const arr = new MyArray(1, 2);
      expect(arr["foo"]).toBeUndefined();
      expect(arr[""]).toBeUndefined();
    });
  });
});
