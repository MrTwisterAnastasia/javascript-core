# MyArray

A simplified custom implementation of JavaScript's Array

## Usage examples

```js
import { MyArray } from "./myArray.js";

// Create
const arr = new MyArray(1, 2, 3);
arr.length; // 3

// push / pop
arr.push(4);   // 4 (new length)
arr.pop();     // 4
arr.length;    // 3

// at (supports negative indices)
arr.at(0);   // 1
arr.at(-1);  // 3

// find
arr.find((x) => x > 1); // 2

// map
arr.map((x) => x * 2); // MyArray { 2, 4, 6 }

// filter
arr.filter((x) => x % 2 === 1); // MyArray { 1, 3 }

// reduce (with and without initial value)
arr.reduce((acc, x) => acc + x);    // 6
arr.reduce((acc, x) => acc + x, 10); // 16

// Iterable — works with for...of and spread
for (const item of arr) {
  console.log(item); // 1, 2, 3
}

[...arr]; // [1, 2, 3]

// Bracket access (via Proxy)
arr[0];     // 1
arr[1] = 9; // set
arr[1];     // 9
```

## Trade-offs and limitations

- Array() can be called with or without new, our MyArray() can be called ONLY with new;
- when we create new MyArray(3) (arg is the lenth of the future array) we create an array with undefined values not empty slots;
- bracket access goes through a Proxy trap, so every property read/write is a bit slower then on a plaine object, but i wanted to have _myArray as one source of truth for index/value;
- _myArray is plaine object, so we always see the values plus its key-index-number the real array is more compuct [el1, el2 ...];
- _myArray is not private field (could not create a Proxy implementation with private field) so we can mannually add any props to it that doesnt belong to array logic;
- heavily relaying on integer-keyed properties iterate in numeric order;
- re/calculation of the length is expensive and we make it twice per call for push, pop, reduce methods;
- no shift/unshift methods and so on in this implementation;

## Run tests

```bash
npm test
```
