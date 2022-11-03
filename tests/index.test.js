import all, {
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

  it('default export contains 4 functions', () => {
    // eslint-disable-next-line import/no-named-as-default-member
    expect(all.match).toBe(match);
    // eslint-disable-next-line import/no-named-as-default-member
    expect(all.matchString).toBe(matchString);
    // eslint-disable-next-line import/no-named-as-default-member
    expect(all.matchList).toBe(matchList);
    // eslint-disable-next-line import/no-named-as-default-member
    expect(all.filter).toBe(filter);
  });
});
