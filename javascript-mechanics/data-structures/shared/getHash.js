import { getObjectHash } from "./getObjectHash.js";

export function getHash(value, capacity) {
  if (typeof value === "object") {
    return getObjectHash(value, capacity);
  }

  const str = value.toString();
  let hash = 0;

  for (var i = 0, len = str.length; i < len; i++) {
    hash += str.charCodeAt(i);
  }

  return hash % capacity;
}
