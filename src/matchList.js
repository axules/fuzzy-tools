import { defaultOptions, isString, isObject } from './utils';
import { matchString } from './matchString';

export function matchList(what, whereList, options) {
  if (
    !what ||
    !whereList ||
    !Array.isArray(whereList) ||
    whereList.length == 0
  ) {
    return null;
  }

  const { withScore } = defaultOptions(options);
  const results = whereList.reduce((R, el, i) => {
    const result = matchString(what, isString(el) ? el : el.value, options);
    if (result) {
      R[i] = Object.assign(
        result,
        { original: el, index: i },
        isObject(el) && Object.prototype.hasOwnProperty.call(el, 'rate')
          ? { score: result.score * el.rate }
          : {}
      );
    }
    return R;
  }, {});

  if (Object.values(results).length === 0) return null;
  if (!withScore) return { score: 1, matches: results };

  const values = Object.values(results);
  return values.reduce(
    (R, el, i) => {
      R.score += el.score;
      if (i > 0 && i === values.length - 1) {
        R.score /= values.length;
      }
      return R;
    },
    { score: 0, matches: results }
  );
}
