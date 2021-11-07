"use strict";

exports.__esModule = true;
exports.defaultOptions = defaultOptions;
exports.getDataExtractor = getDataExtractor;
exports.getValue = getValue;
exports.isFunction = isFunction;
exports.isObject = isObject;
exports.isString = isString;
var DEFAULT_OPTIONS = {
  caseInsensitive: true,
  withScore: true,
  withWrapper: null,
  withRanges: false,
  itemWrapper: null,
  rates: {}
};

function defaultOptions(options) {
  return options ? Object.assign({}, DEFAULT_OPTIONS, options) : DEFAULT_OPTIONS;
}

function isFunction(value) {
  return typeof value === 'function';
}

function isObject(value) {
  return typeof value === 'object';
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