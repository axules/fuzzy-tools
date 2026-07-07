import all, {
  match,
  matchString,
  matchList,
  filter,
} from './importRouter';


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
    expect(all.match).toBe(match);

    expect(all.matchString).toBe(matchString);

    expect(all.matchList).toBe(matchList);

    expect(all.filter).toBe(filter);
  });
});
