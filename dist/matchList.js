"use strict";

exports.__esModule = true;
exports.matchList = matchList;

var _utils = require("./utils");

var _matchString = require("./matchString");

function matchList(what, whereList, options) {
  if (!what || !whereList || !Array.isArray(whereList) || whereList.length == 0) {
    return null;
  }

  var _defaultOptions = (0, _utils.defaultOptions)(options),
      withScore = _defaultOptions.withScore;

  var results = whereList.reduce(function (R, el, i) {
    var result = (0, _matchString.matchString)(what, (0, _utils.isString)(el) ? el : el.value, options);

    if (result) {
      R[i] = Object.assign(result, {
        original: el,
        index: i
      }, (0, _utils.isObject)(el) && Object.prototype.hasOwnProperty.call(el, 'rate') ? {
        score: result.score * el.rate
      } : {});
    }

    return R;
  }, {});
  if (Object.values(results).length === 0) return null;
  if (!withScore) return {
    score: 1,
    matches: results
  };
  var values = Object.values(results);
  return values.reduce(function (R, el, i) {
    R.score += el.score;

    if (i > 0 && i === values.length - 1) {
      R.score /= values.length;
    }

    return R;
  }, {
    score: 0,
    matches: results
  });
}