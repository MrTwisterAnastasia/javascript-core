# MyMap

A simplified custom implementation of JavaScript's Map, built on a hash table with an index-based chain for collision resolution.

## Usage examples

```js
import { MyMap } from "./myMap.js";

// Create from an iterable of [key, value] pairs
const map = new MyMap([
  ["a", 1],
  ["b", 2],
]);
map.size; // 2

// set / get / has
map.set("c", 3);
map.get("a");       // 1
map.has("b");       // true
map.has("missing"); // false

// update in place (size and position preserved)
map.set("a", 10);
map.get("a"); // 10

// delete (throws if the key is absent)
map.delete("b");
map.has("b"); // false
map.size;     // 2

// clear — resets everything
map.clear();
map.size; // 0

// Iteration — entries / keys / values
const m = new MyMap([["a", 1], ["b", 2]]);

[...m.entries()]; // [["a", 1], ["b", 2]]
[...m.keys()];    // ["a", "b"]
[...m.values()];  // [1, 2]

// Iterable — works with for...of and spread (yields [key, value])
for (const [key, value] of m) {
  console.log(key, value); // "a" 1, "b" 2
}

[...m]; // [["a", 1], ["b", 2]]
```

## Trade-offs and limitations

- Fixed capacityOfHashTable of 150 — no resize as is in real Map;
- Only object type has it separate hash function logic, everything else becomes string by .toString() method and we create hash based on its .toString() value;
- Hash function for strings is a plain char-code sum modulo capacity. Anagrams (`"ab"` and `"ba"`) always collide;
- delete method leaves null holes in dataTable to preserve insertion order. dataTable.length and nextDataTableIndex grow monotonically — over many set/delete cycles, memory grows even though size stays small;
- size walks dataTable and filters out nulls on every read;

## Run tests

```bash
npm test
```
