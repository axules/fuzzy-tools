"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.matchList = matchList;
var _utils = require("./utils");
var _matchString = require("./matchString");
function isValidRate(rate) {
  const result = !rate || rate > 0 && rate <= 1;
  if (!result) {
    console.warn('fuzzy-tools', 'rate should be `> 0` and `<= 1`, another value will be ignored. Current value: ', rate);
  }
  return result;
}
function matchList(what, whereList, options) {
  const isArray = Array.isArray(whereList);
  if (!what || !whereList || !isArray && !(0, _utils.isObject)(whereList) || whereList.length <= 0) {
    return null;
  }
  const {
    withScore,
    rates
  } = (0, _utils.defaultOptions)(options);
  const results = Object.entries(whereList).reduce((R, [key, el]) => {
    const realKey = isArray ? Number(key) : key;
    const elValue = !el || (0, _utils.isString)(el) ? el : el.value;
    const elRate = el && (0, _utils.isObject)(el) && Object.prototype.hasOwnProperty.call(el, 'rate') && isValidRate(el.rate) ? el.rate : rates && !!rates[realKey] && isValidRate(rates[realKey]) ? rates[realKey] : null;
    const result = (0, _matchString.matchString)(what, elValue, options);
    if (result) {
      R[realKey] = Object.assign(result, {
        original: elValue,
        index: realKey
      }, elRate ? {
        score: result.score / elRate,
        rate: elRate
      } : {});
    }
    return R;
  }, {});
  if (Object.values(results).length === 0) return null;
  if (!withScore) return {
    score: 1,
    matches: results
  };
  const values = Object.values(results);
  return values.reduce((R, el) => {
    R.score = Math.min(R.score, el.score);
    return R;
  }, {
    score: Number.POSITIVE_INFINITY,
    matches: results
  });
}