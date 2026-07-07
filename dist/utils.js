"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DEFAULT_OPTIONS = void 0;
exports.defaultOptions = defaultOptions;
exports.getDataExtractor = getDataExtractor;
exports.getRegExpWithFrom = getRegExpWithFrom;
exports.getValue = getValue;
exports.isFunction = isFunction;
exports.isObject = isObject;
exports.isRegExp = isRegExp;
exports.isString = isString;
exports.searchIn = searchIn;
const DEFAULT_OPTIONS = exports.DEFAULT_OPTIONS = {
  caseSensitive: false,
  withScore: false,
  withWrapper: null,
  withRanges: false,
  itemWrapper: null,
  rates: {}
};
function defaultOptions(options) {
  return options ? {
    ...DEFAULT_OPTIONS,
    ...options
  } : DEFAULT_OPTIONS;
}
function isFunction(value) {
  return typeof value === 'function';
}
function isObject(value) {
  return !!value && typeof value === 'object';
}
function isRegExp(value) {
  return value instanceof RegExp;
}
function isString(value) {
  return typeof value === 'string';
}
function getValue(obj, keys = []) {
  if (!obj || !isObject(obj)) return undefined;
  let value = obj;
  const keysList = Array.isArray(keys) ? keys : String(keys).split('.');
  while (keysList.length && value) {
    const k = keysList.shift();
    value = !value || !isObject(value) ? undefined : value[k];
  }
  return value;
}
function getDataExtractor(fields) {
  if (!fields) return null;
  const fieldsList = Object.entries(Array.isArray(fields) ? fields.reduce((R, el) => Object.assign(R, {
    [el]: 1
  }), {}) : isObject(fields) ? fields : {
    [fields]: 1
  }).map(([k, rate]) => ({
    rate: parseFloat(rate) || 1,
    field: k,
    path: k
  }));
  if (fieldsList.length <= 0) return null;
  return value => {
    if (isString(fields)) return getValue(value, fields);
    return fieldsList.reduce((R, el) => Object.assign(R, {
      [el.field]: el.rate === 1 ? getValue(value, el.path) : {
        ...el,
        value: getValue(value, el.path)
      }
    }), {});
  };
}
function getRegExpWithFrom(reg, from = undefined) {
  return new RegExp(`(.{${from && from > 0 ? from : 0},}?)(${reg.source})`, reg.flags);
}
function searchIn(where, what, from = undefined) {
  const isRegExp = what instanceof RegExp;
  if (isRegExp) {
    const regExpWithFrom = getRegExpWithFrom(what, from);
    const {
      1: before = false,
      2: found = ''
    } = regExpWithFrom.exec(where) || {};
    if (!found) return [-1, ''];
    return [before.length, found];
  }
  const start = where.indexOf(what, from);
  return [start, start >= 0 ? what : ''];
}