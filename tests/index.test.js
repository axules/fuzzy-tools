import {
  match,
  matchString,
  matchList,
  filter
} from '../src/index';

const testData = [
  ['match', match, 3],
  ['matchString', matchString, 3],
  ['matchList', matchList, 3],
  ['filter', filter, 3],
];

describe('index.js', () => {
  it.each(testData)('should export `%s` function', (name, fn, args) => {
    expect(typeof fn).toBe('function');
    expect(match.length).toBe(args);
  });
});
