const hashCodeSymbol = Symbol("HASH_CODE_SYMBOL");

export function getObjectHash(key, capacityOfHashTable) {
  if (typeof key !== "object" || key === null) {
    throw new Error("in getObjectHash the prop should be an object");
  }

  let hash = key[hashCodeSymbol];

  if (hash === undefined) {
    hash = ((Math.random() * 0x40000000) | 0) % capacityOfHashTable;

    Object.defineProperty(key, hashCodeSymbol, {
      value: hash,
      writable: false,
      enumerable: false,
      configurable: false,
    });
  }

  return hash;
}
