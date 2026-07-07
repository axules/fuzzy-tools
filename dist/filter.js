"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.filter = filter;
var _utils = require("./utils");
var _match = require("./match");
function filter(what, dataList, options) {
  if (!what || !dataList || !Array.isArray(dataList)) {
    return [];
  }
  const {
    extract,
    itemWrapper
  } = (0, _utils.defaultOptions)(options);
  const extractFunc = !extract || (0, _utils.isFunction)(extract) ? extract : (0, _utils.getDataExtractor)(extract);
  return dataList.reduce((R, row, i) => {
    const data = extract ? extractFunc(row) : row;
    const fuzzyResult = (0, _match.match)(what, data, options);
    if (fuzzyResult) {
      const el = itemWrapper ? itemWrapper(row, fuzzyResult, {
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