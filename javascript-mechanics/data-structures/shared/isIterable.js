export function isIterable(value) {
  return Symbol.iterator in Object(value);
}
