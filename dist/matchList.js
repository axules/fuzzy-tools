"use strict";

exports.__esModule = true;
exports.matchList = matchList;

var _utils = require("./utils");

var _matchString = require("./matchString");

function isValidRate(rate) {
  var result = rate == null || rate > 0 && rate <= 1;

  if (!result) {
    console.warn('fuzzy-tools', 'rate should be `> 0` and `<= 1`, another value will be ignored. Current value: ', rate);
  }

  return result;
}

function matchList(what, whereList, options) {
  if (!what || !whereList || !Array.isArray(whereList) && !(0, _utils.isObject)(whereList) || whereList.length == 0) {
    return null;
  }

  var isArray = Array.isArray(whereList);

  var _defaultOptions = (0, _utils.defaultOptions)(options),
      withScore = _defaultOptions.withScore,
      rates = _defaultOptions.rates;

  var results = Object.entries(whereList).reduce(function (R, _ref) {
    var key = _ref[0],
        el = _ref[1];
    var realKey = isArray ? Number(key) : key;
    var elValue = !el || (0, _utils.isString)(el) ? el : el.value;
    var elRate = el && (0, _utils.isObject)(el) && Object.prototype.hasOwnProperty.call(el, 'rate') && isValidRate(el.rate) ? el.rate : rates && rates[realKey] != null && isValidRate(rates[realKey]) ? rates[realKey] : null;
    var result = (0, _matchString.matchString)(what, elValue, options);

    if (result) {
      R[realKey] = Object.assign(result, {
        original: elValue,
        index: realKey
      }, elRate == null ? {} : {
        score: result.score / elRate,
        rate: elRate
      });
    }

    return R;
  }, {});
  if (Object.values(results).length === 0) return null;
  if (!withScore) return {
    score: 1,
    matches: results
  };
  var values = Object.values(results);
  return values.reduce(function (R, el) {
    R.score = Math.min(R.score, el.score);
    return R;
  }, {
    score: Number.POSITIVE_INFINITY,
    matches: results
  });
}