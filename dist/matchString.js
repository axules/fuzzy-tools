"use strict";

exports.__esModule = true;
exports.matchString = matchString;

var _utils = require("./utils");

function computeScore(begin, end, fullLength, wordNumber) {
  var wordLen = end - begin + 1;
  var kd = 1 / fullLength * wordLen;
  var kp = begin || 0.001;
  var kw = 1 + 1 / fullLength * wordNumber;
  return kd * kp * kw;
}

function matchString(what, where, options) {
  if (!what || !where) return null;

  var _defaultOptions = (0, _utils.defaultOptions)(options),
      caseInsensitive = _defaultOptions.caseInsensitive,
      withScore = _defaultOptions.withScore,
      withWrapper = _defaultOptions.withWrapper,
      withRanges = _defaultOptions.withRanges;

  var preparedWhat = caseInsensitive ? String(what).toLocaleLowerCase() : String(what);
  var preparedWhere = caseInsensitive ? String(where).toLocaleLowerCase() : String(where);
  if (!preparedWhat || !preparedWhere || preparedWhat.length > preparedWhere.length) return null;
  var wrapped = null;
  var ranges = null;
  var chunkBegin = 0;
  var scoreList = [];
  var wrapperFunc = !withWrapper || (0, _utils.isFunction)(withWrapper) ? withWrapper : function (w) {
    return withWrapper.replace('{?}', w);
  };

  var wordAction = function wordAction(prev, next) {
    if (prev < 0) {
      if (withWrapper) {
        wrapped = next > 0 ? preparedWhere.slice(0, next) : '';
      }

      if (withRanges) {
        ranges = [];
      }

      chunkBegin = next;
    } else if (next - prev > 1) {
      if (withWrapper) {
        var chunk = preparedWhere.slice(chunkBegin, prev + 1);
        wrapped += wrapperFunc(chunk) + preparedWhere.slice(prev + 1, next);
      }

      if (withRanges) {
        ranges.push({
          begin: chunkBegin,
          end: Math.min(prev, preparedWhere.length - 1)
        });
      }

      if (withScore) {
        scoreList.push(computeScore(chunkBegin, prev, preparedWhat.length, scoreList.length));
      }

      chunkBegin = next;
    }
  };

  var pos = -1;

  for (var i = 0; i < preparedWhat.length; i++) {
    var nextPos = preparedWhere.indexOf(preparedWhat[i], pos + 1);
    if (nextPos < 0 || nextPos >= preparedWhere.length) return null;
    wordAction(pos, nextPos);
    pos = nextPos;
  }

  wordAction(pos, pos + preparedWhere.length);
  return Object.assign({
    score: withScore ? scoreList.reduce(function (p, c) {
      return p + c;
    }, 0) : 1
  }, withWrapper ? {
    wrapped: wrapped
  } : {}, withRanges ? {
    ranges: ranges
  } : {});
}