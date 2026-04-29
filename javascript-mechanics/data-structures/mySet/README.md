# MySet

A simplified custom implementation of JavaScript's Set, built on a hash table with an index-based chain for collision resolution.

## Usage examples

```js
import { MySet } from "./mySet.js";

// Create from an iterable of values (duplicates are skipped)
const set = new MySet([1, 2, 2, 3]);
set.size; // 3

// add / has
set.add(4);
set.has(1);       // true
set.has("missing"); // false

// add is chainable and ignores duplicates
set.add(5).add(5).add(6);
set.size; // 6

// delete — returns a boolean
set.delete(2); // true
set.delete(2); // false (already gone)
set.has(2);    // false

// clear — resets everything
set.clear();
set.size; // 0

// SameValueZero equality — NaN equals NaN, +0 equals -0
const s = new MySet();
s.add(NaN);
s.has(NaN); // true
s.add(+0);
s.has(-0); // true

// Iteration — entries / keys / values
const m = new MySet(["a", "b"]);

[...m.entries()]; // [["a", "a"], ["b", "b"]]
[...m.keys()];    // ["a", "b"]
[...m.values()];  // ["a", "b"]

// Iterable — works with for...of and spread (yields each value)
for (const value of m) {
  console.log(value); // "a", "b"
}

[...m]; // ["a", "b"]
```

## Trade-offs and limitations

- Fixed capacityOfHashTable of 150 — no resize as is in real Set;
- Only object type has it separate hash function logic, everything else becomes string by .toString() method and we create hash based on its .toString() value;
- Hash function for strings is a plain char-code sum modulo capacity;
- delete method leaves null holes in dataTable to preserve insertion order. dataTable.length and nextDataTableIndex grow monotonically — over many add/delete cycles, memory grows even though size stays small;
- size walks dataTable and filters out nulls on every read;

## Run tests

```bash
npm test
```
