import { defaultOptions, isString, isObject } from './utils';
import { matchString } from './matchString';

function isValidRate(rate) {
  return rate === null || (rate > 0 && rate <= 1);
}

export function matchList(what, whereList, options) {
  if (
    !what ||
    !whereList ||
    (!Array.isArray(whereList) && !isObject(whereList)) ||
    whereList.length == 0
  ) {
    return null;
  }

  const isArray = Array.isArray(whereList);
  const { withScore } = defaultOptions(options);
  const results = Object.entries(whereList).reduce((R, [key, el]) => {
    const elValue = !el || isString(el) ? el : el.value;
    let elRate = isObject(el) && Object.prototype.hasOwnProperty.call(el, 'rate') ? el.rate : null;
    if (!isValidRate(elRate)) {
      console.warn(
        'fuzzy-tools',
        'rate should be `> 0` and `<= 1`, another value will be ignored. Current value: ',
        elRate
      );
      elRate = null;
    }
    const result = matchString(what, elValue, options);
    if (result) {
      R[key] = Object.assign(
        result,
        { original: elValue, index: isArray ? Number(key) : key },
        elRate === null
          ? {}
          : { score: result.score / el.rate, rate: elRate }
      );
    }
    return R;
  }, {});

  if (Object.values(results).length === 0) return null;
  if (!withScore) return { score: 1, matches: results };

  const values = Object.values(results);
  return values.reduce(
    (R, el) => {
      R.score = Math.min(R.score, el.score);
      return R;
    },
    { score: Number.POSITIVE_INFINITY, matches: results }
  );
}
