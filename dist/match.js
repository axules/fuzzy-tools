"use strict";

exports.__esModule = true;
exports.match = match;
var _matchString = require("./matchString");
var _matchList = require("./matchList");
var _utils = require("./utils");
function match(what, where, options) {
  if (!what || !where) {
    return null;
  }
  return Array.isArray(where) || (0, _utils.isObject)(where) ? (0, _matchList.matchList)(what, where, options) : (0, _matchString.matchString)(what, where, options);
}