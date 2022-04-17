const DEFAULT_OPTIONS = {
  caseSensitive: false,
  withScore: false,
  withWrapper: null,
  withRanges: false,
  itemWrapper: null,
  rates: {},
};

export function defaultOptions(options) {
  const deprecationOverride = {};
  if (options && Object.prototype.hasOwnProperty.call(options, 'caseInsensitive')) {
    console.warn('fuzzy-tools: `caseInsensitive` is deprecated, use `caseSensitive` instead of `caseInsensitive`');
    if (!Object.prototype.hasOwnProperty.call(options, 'caseSensitive')) {
      deprecationOverride.caseSensitive = !options.caseInsensitive;
    }
  }
  return options ? { ...DEFAULT_OPTIONS, ...options, ...deprecationOverride } : DEFAULT_OPTIONS;
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

export function getValue(obj, keys = []) {
  if (!obj || !isObject(obj)) return undefined;
  let value = obj;
  const keysList = Array.isArray(keys) ? keys : String(keys).split('.');
  while (keysList.length && value) {
    const k = keysList.shift();
    value = !value || !isObject(value) ? undefined : value[k];
  }
  return value;
}

export function getDataExtractor(fields) {
  if (!fields) return null;
  const fieldsList = Object.entries(
    Array.isArray(fields)
      ? fields.reduce((R, el) => Object.assign(R, { [el]: 1 }), {})
      : isObject(fields)
        ? fields
        : { [fields]: 1 }
  ).map(([k, rate]) => ({
    rate: parseFloat(rate) || 1,
    field: k,
    path: k
  }));
  if (fieldsList.length == 0) return null;
  return (value) => {
    if (isString(fields)) return getValue(value, fields);
    return fieldsList.reduce(
      (R, el) => Object.assign(
        R,
        { [el.field]: el.rate === 1
          ? getValue(value, el.path)
          : { ...el, value: getValue(value, el.path) }
        }
      ),
      {}
    );
  };
}