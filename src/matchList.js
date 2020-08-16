import { defaultOptions, isString, isObject } from './tests/utils';
import { matchString } from './matchString';

export function matchList(what, whereList, options) {
  const { withRanges, withScore, withWrapper } = defaultOptions(options);
  const results = whereList.reduce((R, el) => {
    const result = matchString(
      what,
      isString(el) ? el : el.value,
      options
    );
    if (result) {
      R.push(
        Object.assign(
          result,
          { original: el },
          isObject(el) && Object.prototype.hasOwnProperty.call(el, 'rate')
            ? { score: result.score * el.rate }
            : {}
        )
      );
    }
    return R;
  }, []);

  if (results.length === 0) return null;
  if (!withScore && !withRanges && !withWrapper) return { score: 1 };

  return results.reduce(
    (R, el, i) => {
      if (withScore) {
        if (!R.scores) R.scores = [];
        R.scores.push(el.score);
        R.score += el.score;
        if (i === results.length - 1) {
          R.score /= results.length;
        }
      }

      if (withRanges) {
        if (!R.ranges) R.ranges = [];
        R.ranges.push(el.ranges);
      }

      if (withWrapper) {
        if (!R.wrapped) R.wrapped = [];
        R.wrapped.push(el.wrapped);
      }

      return R;
    },
    { score: withScore ? 0 : 1 }
  );
}
