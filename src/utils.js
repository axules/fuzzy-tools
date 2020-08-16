export function getIndexOf(str, substr, from, caseInsensitive) {
  const index = str.indexOf(substr, from);
  return index < 0 && caseInsensitive
    ? str.indexOf(substr.toLocaleUpperCase(), from)
    : index;
}

const DEFAULT_OPTIONS = {
  caseInsensitive: true,
  withScore: true,
  withWrapper: false,
  withRanges: false,
  itemWrapper: null
};

export function defaultOptions(options) {
  return options ? { ...DEFAULT_OPTIONS, ...options } : DEFAULT_OPTIONS;
}

export function isFunction(value) {
  return typeof value === 'function';
}

export function isObject(value) {
  return typeof value === 'object';
}

export function isString(value) {
  return typeof value === 'string';
}

export function getValue(obj, keys) {
  let value = obj;
  const keysList = Array.isArray(keys) ? keys : keys.split('.');
  while (keysList.length && value) {
    const k = keysList.shift();
    value = !value || !isObject ? undefined : value[k];
  }
  return value;
}

export function getDataExtractor(fields) {
  const fieldsList = Object.entries(
    Array.isArray(fields)
      ? fields.reduce((R, el) => Object.assign(R, { [el]: 1 }), {})
      : isObject(fields)
        ? fields
        : { [fields]: 1 }
  ).map(([k, rate]) => ({
    rate: parseFloat(rate) || 1,
    field: Array.isArray(k) ? k.join('.') : k,
    path: k
  }));
  return (value) => {
    if (isString(fields)) return getValue(value, fields);
    return fieldsList.map((field) => ({ ...field, value: getValue(value, k) }));
  };
}