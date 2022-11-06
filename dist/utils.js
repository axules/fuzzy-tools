"use strict";

exports.__esModule = true;
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
var DEFAULT_OPTIONS = {
  caseSensitive: false,
  withScore: false,
  withWrapper: null,
  withRanges: false,
  itemWrapper: null,
  rates: {}
};
exports.DEFAULT_OPTIONS = DEFAULT_OPTIONS;
function defaultOptions(options) {
  return options ? Object.assign({}, DEFAULT_OPTIONS, options) : DEFAULT_OPTIONS;
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
function getValue(obj, keys) {
  if (keys === void 0) {
    keys = [];
  }
  if (!obj || !isObject(obj)) return undefined;
  var value = obj;
  var keysList = Array.isArray(keys) ? keys : String(keys).split('.');
  while (keysList.length && value) {
    var k = keysList.shift();
    value = !value || !isObject(value) ? undefined : value[k];
  }
  return value;
}
function getDataExtractor(fields) {
  var _ref;
  if (!fields) return null;
  var fieldsList = Object.entries(Array.isArray(fields) ? fields.reduce(function (R, el) {
    var _Object$assign;
    return Object.assign(R, (_Object$assign = {}, _Object$assign[el] = 1, _Object$assign));
  }, {}) : isObject(fields) ? fields : (_ref = {}, _ref[fields] = 1, _ref)).map(function (_ref2) {
    var k = _ref2[0],
      rate = _ref2[1];
    return {
      rate: parseFloat(rate) || 1,
      field: k,
      path: k
    };
  });
  if (fieldsList.length == 0) return null;
  return function (value) {
    if (isString(fields)) return getValue(value, fields);
    return fieldsList.reduce(function (R, el) {
      var _Object$assign2;
      return Object.assign(R, (_Object$assign2 = {}, _Object$assign2[el.field] = el.rate === 1 ? getValue(value, el.path) : Object.assign({}, el, {
        value: getValue(value, el.path)
      }), _Object$assign2));
    }, {});
  };
}
function getRegExpWithFrom(reg, from) {
  if (from === void 0) {
    from = undefined;
  }
  return new RegExp("(.{" + (from && from > 0 ? from : 0) + ",}?)(" + reg.source + ")", reg.flags);
}
function searchIn(where, what, from) {
  if (from === void 0) {
    from = undefined;
  }
  var isRegExp = what instanceof RegExp;
  if (isRegExp) {
    var regExpWithFrom = getRegExpWithFrom(what, from);
    var _ref3 = regExpWithFrom.exec(where) || {},
      _ref3$ = _ref3[1],
      before = _ref3$ === void 0 ? false : _ref3$,
      _ref3$2 = _ref3[2],
      found = _ref3$2 === void 0 ? '' : _ref3$2;
    if (!found) return [-1, ''];
    return [before.length, found];
  }
  var start = where.indexOf(what, from);
  return [start, start >= 0 ? what : ''];
}