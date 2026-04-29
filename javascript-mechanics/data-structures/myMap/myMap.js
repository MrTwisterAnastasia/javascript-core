import { MyArray } from "../myArray/myArray.js";
import { sameValueZero } from "../shared/sameValueZero.js";
import { isIterable } from "../shared/isIterable.js";
import { getHash } from "../shared/getHash.js";

export class Entry {
  // key: any, value: any, chain: number
  // we can have a hash collision, chain prop will help as to solve it
  constructor(key, value, chain) {
    if (typeof chain !== "number") {
      throw new Error("Chain prop should be a number");
    }

    this.key = key;
    this.value = value;
    this.chain = chain;
  }

  setValue(value) {
    this.value = value;
  }

  setChain(chain) {
    if (typeof chain !== "number") {
      throw new Error("Chain prop should be a number");
    }

    this.chain = chain;
  }
}

export class MyMap {
  // max 150 empty buckets (just random number, because we did not implement the resize logic)
  capacityOfHashTable = 150;
  // -1 value means that a busket in the hash table is empty
  hashTable = new MyArray(this.capacityOfHashTable).map(() => -1);
  // dataTable: Array<Entry | null>;
  dataTable = new MyArray();
  nextDataTableIndex = 0;

  *[Symbol.iterator]() {
    for (let index = 0; index < this.dataTable.length; index++) {
      const entry = this.dataTable[index];

      if (entry) {
        const { key, value } = entry;
        yield [key, value];
      }
    }
  }

  constructor(iterable) {
    if (isIterable(iterable)) {
      for (let [key, value] of iterable) {
        this.set(key, value);
      }
    }
  }

  get size() {
    return this.dataTable.filter((entry) => !!entry).length;
  }

  getHashByKey(key) {
    return getHash(key, this.capacityOfHashTable);
  }

  // adds a new entry with a specified key and value to this Map, or updates an existing entry if the key already exists.
  set(key, value) {
    const hashTableBucket = this.getHashByKey(key);

    // to solve the hash collision we need to track if the basket is empty (-1) or has entry index
    const latestIndex = this.hashTable[hashTableBucket];

    if (this.has(key)) {
      const entryToUpdate = this.#findEntry(key, latestIndex);

      entryToUpdate.setValue(value);

      return;
    }

    // saving index entry into hash table bucket for the faster search
    this.hashTable[hashTableBucket] = this.nextDataTableIndex;

    // adding the entry to the next index of data table
    this.dataTable[this.nextDataTableIndex] = new Entry(
      key,
      value,
      latestIndex,
    );

    this.nextDataTableIndex++;
  }

  // returns a boolean indicating whether an entry with the specified key exists in this Map or not.
  has(key) {
    return this.get(key) !== undefined;
  }

  // returns the value corresponding to the key in this Map, or undefined if there is none
  get(key) {
    return this.#getEntryByKey(key)?.value;
  }

  // removes the entry specified by the key from this Map.
  delete(key) {
    const hashTableBucket = this.getHashByKey(key);

    const latestIndex = this.hashTable[hashTableBucket];
    const latestEntry = this.dataTable[latestIndex];

    const indexOfEntryToEmpty = this.#findEntryIndex(key, latestIndex);
    const entryToEmpty = this.dataTable[indexOfEntryToEmpty];

    if (!entryToEmpty) {
      return false;
    }

    const isEntryToEmptyLatest = sameValueZero(latestEntry.key, key);

    if (isEntryToEmptyLatest) {
      this.hashTable[hashTableBucket] = entryToEmpty.chain;
    } else {
      const parentEntry = this.#getParent(key, latestEntry);
      parentEntry?.setChain(entryToEmpty.chain);
    }

    this.dataTable[indexOfEntryToEmpty] = null;

    return true;
  }

  clear() {
    this.hashTable = new MyArray(this.capacityOfHashTable).map(() => -1);
    this.dataTable = new MyArray();
    this.nextDataTableIndex = 0;
  }

  entries() {
    return this[Symbol.iterator]();
  }

  *keys() {
    for (const [key] of this) {
      yield key;
    }
  }

  *values() {
    for (const [, value] of this) {
      yield value;
    }
  }

  #getEntryByKey(key) {
    const hashTableBucket = this.getHashByKey(key);
    const latestIndex = this.hashTable[hashTableBucket];

    return this.#findEntry(key, latestIndex);
  }

  // we need to check all the chain to find entry with the correct key
  #findEntry(key, latestIndex) {
    const entry = this.dataTable[latestIndex];
    if (!entry) {
      return undefined;
    }

    if (sameValueZero(entry.key, key)) {
      return entry;
    }

    const hasNextEntryIndexInChain = entry.chain !== -1;

    if (hasNextEntryIndexInChain) {
      return this.#findEntry(key, entry.chain);
    }

    return undefined;
  }

  #findEntryIndex(key, latestIndex) {
    const entry = this.dataTable[latestIndex];

    if (!entry) {
      return undefined;
    }

    if (sameValueZero(entry.key, key)) {
      return latestIndex;
    }

    const hasNextEntryIndexInChain = entry.chain !== -1;

    if (hasNextEntryIndexInChain) {
      return this.#findEntryIndex(key, entry.chain);
    }

    return undefined;
  }

  #getParent(key, latestEntry) {
    if (latestEntry.chain === -1) {
      return undefined;
    }

    const secondLatestEntry = this.dataTable[latestEntry.chain];

    if (sameValueZero(secondLatestEntry.key, key)) {
      return latestEntry;
    }

    return this.#getParent(key, secondLatestEntry);
  }
}
