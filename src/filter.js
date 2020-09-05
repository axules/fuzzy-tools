import { defaultOptions, getDataExtractor, isFunction } from './utils';
import { match } from './match';

export function filter(what, dataList, options) {
  if (!what || !dataList || !Array.isArray(dataList)) {
    return [];
  }
  const { extract, itemWrapper } = defaultOptions(options);
  const extractFunc =
    !extract || isFunction(extract) ? extract : getDataExtractor(extract);

  return dataList.reduce((R, row, i) => {
    const data = extract ? extractFunc(row) : row;
    const fuzzyResult = match(what, data, options);
    if (fuzzyResult) {
      const el = itemWrapper
        ? itemWrapper(row, fuzzyResult, { index: i, result: R })
        : row;
      if (el) {
        R.push(el);
      }
    }
    return R;
  }, []);
}