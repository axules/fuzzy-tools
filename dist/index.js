"use strict";

exports.__esModule = true;
exports.default = void 0;

var _matchString = require("./matchString");

exports.matchString = _matchString.matchString;

var _matchList = require("./matchList");

exports.matchList = _matchList.matchList;

var _match = require("./match");

exports.match = _match.match;

var _filter = require("./filter");

exports.filter = _filter.filter;
var _default = {
  match: _match.match,
  matchString: _matchString.matchString,
  matchList: _matchList.matchList,
  filter: _filter.filter
};
exports.default = _default;