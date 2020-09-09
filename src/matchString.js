import { defaultOptions, isFunction, getIndexOf } from './utils';

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
    caseInsensitive,
    withScore,
    withWrapper,
    withRanges
  } = defaultOptions(options);
  const preparedWhat = caseInsensitive ? String(what).toLocaleLowerCase() : String(what);
  const preparedWhere = String(where);
  if (!preparedWhat || !preparedWhere || preparedWhat.length > preparedWhere.length) return null;

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
        wrapped = next > 0 ? preparedWhere.slice(0, next) : '';
      }
      if (withRanges) {
        ranges = [];
      }
      chunkBegin = next;
    } else if (next - prev > 1) {
      if (withWrapper) {
        const chunk = preparedWhere.slice(chunkBegin, prev + 1);
        wrapped += wrapperFunc(chunk) + preparedWhere.slice(prev + 1, next);
      }
      if (withRanges) {
        ranges.push({
          begin: chunkBegin,
          end: Math.min(prev, preparedWhere.length - 1)
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
    const nextPos = getIndexOf(preparedWhere, preparedWhat[i], pos + 1, caseInsensitive);
    if (nextPos < 0 || nextPos >= preparedWhere.length) return null;
    wordAction(pos, nextPos);
    pos = nextPos;
  }
  wordAction(pos, pos + preparedWhere.length);

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
