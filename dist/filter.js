"use strict";

exports.__esModule = true;
exports.filter = filter;

var _utils = require("./utils");

var _match = require("./match");

function filter(what, dataList, options) {
  if (!what || !dataList || !Array.isArray(dataList)) {
    return [];
  }

  var _defaultOptions = (0, _utils.defaultOptions)(options),
      extract = _defaultOptions.extract,
      itemWrapper = _defaultOptions.itemWrapper;

  var extractFunc = !extract || (0, _utils.isFunction)(extract) ? extract : (0, _utils.getDataExtractor)(extract);
  return dataList.reduce(function (R, row, i) {
    var data = extract ? extractFunc(row) : row;
    var fuzzyResult = (0, _match.match)(what, data, options);

    if (fuzzyResult) {
      var el = itemWrapper ? itemWrapper(row, fuzzyResult, {
        index: i,
        result: R
      }) : row;

      if (el) {
        R.push(el);
      }
    }

    return R;
  }, []);
}