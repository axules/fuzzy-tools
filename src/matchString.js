import { defaultOptions, isFunction, searchIn, isRegExp } from './utils';

function computeScore(begin, end, fullLength, wordNumber) {
  const wordLen = end - begin + 1;
  const kd = (1 / fullLength) * wordLen;
  const kp = begin || 0.001;
  const kw = 1 + (1 / fullLength) * wordNumber;
  return kd * kp * kw;
}

export function matchString(what, where, options) {
  if (!what || !where) return null;
  const {
    caseSensitive,
    withScore,
    withWrapper,
    withRanges
  } = defaultOptions(options);
  const isWords = Array.isArray(what);
  if (isWords && what.length == 0) return null;

  const preparedWhat = caseSensitive
    ? (isWords ? what : String(what))
    : (
      isWords
        ? what.map(it => (isRegExp(it) ? it : String(it).toLocaleLowerCase()))
        : String(what).toLocaleLowerCase()
    );
  const originalWhere = String(where);
  if (!preparedWhat || !originalWhere || (!isWords && preparedWhat.length > originalWhere.length)) {
    return null;
  }
  // preparedWhere will be undefined if caseSensitive is true, it is needed to save memory
  const preparedWhere = caseSensitive ? undefined : originalWhere.toLocaleLowerCase();

  let wrapped = null;
  let ranges = null;
  let chunkBegin = 0;
  let scoreList = [];
  const wrapperFunc =
    !withWrapper || isFunction(withWrapper)
      ? withWrapper
      : (w) => withWrapper.replace('{?}', w);

  const wordAction = (prev, next) => {
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
        const chunk = originalWhere.slice(chunkBegin, prev + 1);
        wrapped += wrapperFunc(chunk) + originalWhere.slice(prev + 1, next);
      }
      if (withRanges) {
        ranges.push({
          begin: chunkBegin,
          end: Math.min(prev, originalWhere.length - 1)
        });
      }
      if (withScore) {
        scoreList.push(
          computeScore(chunkBegin, prev, preparedWhat.length, scoreList.length)
        );
      }
      chunkBegin = next;
    }
  };

  let pos = -1;
  for (let i = 0; i < preparedWhat.length; i++) {
    const chunk = isWords ? preparedWhat[i] : preparedWhat.charAt(i);
    let [nextPos, found] = searchIn(preparedWhere || originalWhere, chunk, pos + 1);

    if (nextPos < 0) return null;

    if (isWords && found.length > 1) {
      wordAction(pos, nextPos);
      nextPos = nextPos + found.length - 1;
      pos = nextPos - 1;
    }
    wordAction(pos, nextPos);
    pos = nextPos;
  }
  wordAction(pos, pos + originalWhere.length);

  return Object.assign(
    {
      score: withScore
        ? scoreList.reduce((p, c) => p + c, 0)
        : 1
    },
    withWrapper ? { wrapped } : {},
    withRanges ? { ranges } : {}
  );
}
