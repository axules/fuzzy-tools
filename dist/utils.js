"use strict";

exports.__esModule = true;
exports.getIndexOf = getIndexOf;
exports.defaultOptions = defaultOptions;
exports.isFunction = isFunction;
exports.isObject = isObject;
exports.isString = isString;
exports.getValue = getValue;
exports.getDataExtractor = getDataExtractor;

function getIndexOf(str, substr, from, caseInsensitive) {
  var index = str.indexOf(substr, from);
  return index < 0 && caseInsensitive ? str.indexOf(substr.toLocaleUpperCase(), from) : index;
}

var DEFAULT_OPTIONS = {
  caseInsensitive: true,
  withScore: true,
  withWrapper: null,
  withRanges: false,
  itemWrapper: null
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
    return fieldsList.map(function (field) {
      return Object.assign({}, field, {
        value: getValue(value, field.path)
      });
    });
  };
}