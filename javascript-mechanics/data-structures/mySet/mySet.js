import { isIterable } from "../shared/isIterable.js";
import { MyArray } from "../myArray/myArray.js";
import { getHash } from "../shared/getHash.js";
import { sameValueZero } from "../shared/sameValueZero.js";

export class SetEntity {
  //  value: any, chain: number
  // we can have a hash collision chain prop will help as to solve it
  constructor(value, chain) {
    if (typeof chain !== "number") {
      throw new Error("Chain prop should be a number");
    }

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

export class MySet {
  capacityOfHashTable = 150;
  hashTable = new MyArray(this.capacityOfHashTable).map(() => -1);
  // dataTable: Array<SetEntity | null>;
  dataTable = new MyArray();
  nextDataTableIndex = 0;

  *[Symbol.iterator]() {
    for (let index = 0; index < this.dataTable.length; index++) {
      const entry = this.dataTable[index];

      if (entry) {
        const { value } = entry;
        yield value;
      }
    }
  }

  constructor(iterable) {
    if (isIterable(iterable)) {
      for (let el of iterable) {
        this.add(el);
      }
    }
  }

  get size() {
    return this.dataTable.filter((entry) => !!entry).length;
  }

  *entries() {
    for (const value of this) {
      yield [value, value];
    }
  }

  *keys() {
    for (const value of this) {
      yield value;
    }
  }

  *values() {
    for (const value of this) {
      yield value;
    }
  }

  getHashByValue(value) {
    return getHash(value, this.capacityOfHashTable);
  }

  //inserts the specified value into this set, if it is not already present.
  // return value: The Set object.
  add(value) {
    // if value already exists we dont add it
    if (this.has(value)) {
      return this;
    }

    const hashTableBucket = this.getHashByValue(value);
    // to solve the hash collision we need to track if the basket is empty (-1) or has entity index
    const latestIndex = this.hashTable[hashTableBucket];

    // saving index entity into hash table bucket for the faster search
    this.hashTable[hashTableBucket] = this.nextDataTableIndex;

    // adding the entity to the next index of data table
    this.dataTable[this.nextDataTableIndex] = new SetEntity(value, latestIndex);

    this.nextDataTableIndex++;

    return this;
  }

  // returns a boolean indicating whether the specified value exists in this Set or not.
  has(value) {
    const bucketIndex = this.getHashByValue(value);
    // index that refs to the latest entity in the chain
    const latestIndex = this.hashTable[bucketIndex];

    let entity = this.dataTable[latestIndex];

    while (entity) {
      if (sameValueZero(entity.value, value)) {
        return true; // Value exists
      }

      entity = this.dataTable[entity.chain];
    }

    return false;
  }

  //removes all elements from this set.
  clear() {
    this.hashTable = new MyArray(this.capacityOfHashTable).map(() => -1);
    this.dataTable = new MyArray();
    this.nextDataTableIndex = 0;
  }

  //removes the specified value from this set, if it is in the set.
  // return value: true if a value in the Set object has been removed successfully. false if the value is not found in the Set.
  delete(value) {
    if (!this.has(value)) {
      return false;
    }

    const bucketIndex = this.getHashByValue(value);
    // index that refs to the latest entity in the chains
    const latestIndex = this.hashTable[bucketIndex];
    // latest added entity in the chain (in case of a hash collision)
    const latestEntity = this.dataTable[latestIndex];
    const indexOfEntityToDelete = this.#findEntityxIndex(value, latestIndex);
    const entityToDelete = this.dataTable[indexOfEntityToDelete];

    if (sameValueZero(latestEntity.value, entityToDelete?.value)) {
      this.hashTable[bucketIndex] = entityToDelete.chain;
    } else {
      const parentEntity = this.#getParentEntity(value, latestEntity);
      parentEntity.setChain(entityToDelete.chain);
    }

    this.dataTable[indexOfEntityToDelete] = null;

    return true;
  }

  #findEntityxIndex(value, latestIndex) {
    let currentIndex = latestIndex;

    while (currentIndex !== -1) {
      const entity = this.dataTable[currentIndex];

      if (sameValueZero(entity.value, value)) {
        return currentIndex;
      }

      currentIndex = entity.chain;
    }

    return null;
  }

  #getParentEntity(value, latestEntity) {
    let parentEntity = latestEntity;

    while (parentEntity && parentEntity.chain !== -1) {
      const nextEntity = this.dataTable[parentEntity.chain];
      if (sameValueZero(nextEntity?.value, value)) {
        return parentEntity;
      }

      parentEntity = nextEntity;
    }

    return null;
  }
}
