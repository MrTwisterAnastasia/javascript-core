import { expect, test, describe } from "vitest";
import { update } from "./update";

describe("update", () => {
  test("throws an error if the path argument is NOT Array<string> OR string type", () => {
    expect(() =>
      update({}, 12, 6).toThrow(
        "path argument should have type of either Array<string> or string with pattern: 'key.key'",
      ),
    );
  });

  test("throws an error if keys don't belong to provided object", () => {
    expect(() =>
      update({}, "a", 6).toThrow(
        "The key(s) in the path argument don't belong to provided object",
      ),
    );
  });

  test("throws an error if the path argument of string type does NOT have correct pattern/format ", () => {
    const state = {
      user: {
        name: "John",
        address: {
          city: "Kyiv",
        },
      },
    };

    expect(() =>
      update(state, "user/address/city", "Kharkiv").toThrow(
        "The key(s) in the path argument don't belong to provided object",
      ),
    );
  });

  test("creates new updated object and do NOT modify old one", () => {
    const object = {
      firstName: "John",
      lastName: "Twir",
    };

    const updatedObj = update(object, "lastName", "Swel");

    expect(object).not.toEqual(updatedObj);
  });

  test("updates existing key with the new value", () => {
    const object = {
      firstName: "John",
      lastName: "Twir",
    };

    const newLastName = "Swel";
    const updatedObj = update(object, "lastName", newLastName);

    expect(updatedObj.lastName).toBe(newLastName);
  });

  test("handels nested object updates with Array<string> type of path", () => {
    const state = {
      user: {
        name: "John",
        address: {
          city: "Kyiv",
        },
      },
    };

    const newCity = "Kharkiv";
    const updatedState = update(state, ["user", "address", "city"], newCity);

    expect(updatedState["user"]["address"]["city"]).toBe(newCity);
  });

  test("handels nested object updates with string type of path", () => {
    const state = {
      user: {
        name: "John",
        address: {
          city: "Kyiv",
        },
      },
    };

    const newCity = "Kharkiv";
    const updatedState = update(state, "user.address.city", newCity);

    expect(updatedState["user"]["address"]["city"]).toBe(newCity);
  });
});
