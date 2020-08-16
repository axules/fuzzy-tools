import { isString, defaultOptions, isFunction, getIndexOf } from './utils';

export function matchString(what, where, options) {
  if (
    !what ||
    !where ||
    !isString(what) ||
    !isString(where) ||
    what.length > where.length
  ) {
    return null;
  }

  const {
    caseInsensitive,
    withScore,
    withWrapper,
    withRanges
  } = defaultOptions(options);
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
        wrapped = next > 0 ? where.slice(0, next) : '';
      }
      if (withRanges) {
        ranges = [];
      }
      chunkBegin = next;
      const firstScore = 1 - (1 / where.length) * next;
      scoreList.push(firstScore);
    } else if (next - prev > 1) {
      if (withWrapper) {
        const chunk = where.slice(chunkBegin, prev + 1);
        wrapped += wrapperFunc(chunk) + where.slice(prev + 1, next);
      }
      if (withRanges) {
        ranges.push({
          begin: chunkBegin,
          end: Math.min(prev, where.length - 1)
        });
      }
      if (withScore) {
        const a = chunkBegin;
        const b = prev;
        const wordLen = b - a + 1;
        const kd = (1 / what.length) * wordLen;
        const maxPos = where.length - wordLen + 1;
        const kp = 1 - (1 / maxPos) * a;
        scoreList.push(kd * kp);
        // console.log({ a, b, wordLen, kd, kp, score: kd * kp });
      }
      chunkBegin = next;
    }
  };

  const preparedWhat = caseInsensitive ? what.toLocaleLowerCase() : what;
  let pos = -1;

  for (let i = 0; i < preparedWhat.length; i++) {
    const nextPos = getIndexOf(where, preparedWhat[i], pos + 1, caseInsensitive);
    if (nextPos < 0 || nextPos >= where.length) return null;
    wordAction(pos, nextPos);
    pos = nextPos;
  }
  wordAction(pos, pos + where.length);

  if (withScore) {
    const wordsScore = 1 - (1 / what.length) * (scoreList.length - 2);
    scoreList.push(wordsScore);
  }
  return Object.assign(
    {
      score: withScore
        ? scoreList.reduce((p, c) => p + c, 0) / scoreList.length
        : 1
    },
    withWrapper ? { wrapped } : {},
    withRanges ? { ranges } : {}
  );
}
