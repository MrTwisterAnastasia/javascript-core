// we expect to have path either string[] or "key.key"
export function update(obj, path, value) {
  const keys = isStringArray(path)
    ? path
    : isString(path)
      ? path.split(".")
      : null;

  if (!keys) {
    throw new Error(
      "path argument should have type of either Array<string> or string with pattern: 'key.key'",
    );
  }

  const [firstKey, ...restKeys] = keys;

  // if we want to update old keys OR add new one we can just remove this check
  // but the func name is "update" so we expect to recieve only already existing keys
  if (obj[firstKey] === undefined) {
    throw new Error(
      "The key(s) in the path argument don't belong to provided object",
    );
  }

  return {
    ...obj,
    [firstKey]: !restKeys.length
      ? value
      : update(obj[firstKey], restKeys, value),
  };
}

function isStringArray(value) {
  return Array.isArray(value) && value.every((v) => typeof v === "string");
}

function isString(value) {
  return typeof value === "string";
}
