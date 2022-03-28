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
      caseSensitive = _defaultOptions.caseSensitive,
      withScore = _defaultOptions.withScore,
      withWrapper = _defaultOptions.withWrapper,
      withRanges = _defaultOptions.withRanges;

  var preparedWhat = caseSensitive ? String(what) : String(what).toLocaleLowerCase();
  var originalWhere = String(where);
  if (!preparedWhat || !originalWhere || preparedWhat.length > originalWhere.length) return null; // preparedWhere will be undefined if caseSensitive is true, it is needed to save memory

  var preparedWhere = caseSensitive ? undefined : originalWhere.toLocaleLowerCase();
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
        wrapped = next > 0 ? originalWhere.slice(0, next) : '';
      }

      if (withRanges) {
        ranges = [];
      }

      chunkBegin = next;
    } else if (next - prev > 1) {
      if (withWrapper) {
        var chunk = originalWhere.slice(chunkBegin, prev + 1);
        wrapped += wrapperFunc(chunk) + originalWhere.slice(prev + 1, next);
      }

      if (withRanges) {
        ranges.push({
          begin: chunkBegin,
          end: Math.min(prev, originalWhere.length - 1)
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
    var nextPos = (preparedWhere || originalWhere).indexOf(preparedWhat.charAt(i), pos + 1);
    if (nextPos < 0 || nextPos >= originalWhere.length) return null;
    wordAction(pos, nextPos);
    pos = nextPos;
  }

  wordAction(pos, pos + originalWhere.length);
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