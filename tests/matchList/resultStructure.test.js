import { matchList } from '../../src';

const testData = [
  ['fuz', 7, ['fuz--', '--fuz', 'f--uz', 'fu--z', '-fuz-', 'f-u-z', 'xxfxxx-xxxuxxx-xxzxxxzzzz fu zzz']],
  ['fuzzz', 1, ['fu--', '---u----', '-z-', 'f----', '----fuz----zz']],
  ['with rate', 1, [{ value: 'fu--', rate: 0.2 }, { value: '- with -- rate', rate: 0.8 }]],
  [
    'vu80u581q',
    3,
    [
      'vwl2 bj 0wt1i rm5u-2io 48kl4- 7 _4 mte9u0i 7v ur4yowf-jt5w x6hw6gt 6ihvmv 084ng1ji w99ikng_59 u7j63q ',
      'vu80u581q',
      '----v----u-80u58--1q---',
    ]
  ]
];

describe('matchList(...)', () => {
  test.each(testData)('%#. %s with %d matches', (what, matchCount, whereList) => {
    const result = matchList(what, whereList);
    expect(Object.values(result.matches).length).toBe(matchCount);
    expect(result.score >= 0 && result.score !== 1).toBe(true);
  });

  test.each(testData)('%#. %s without matches (withScore = false)', (what, matchCount, whereList) => {
    const result = matchList(what, whereList, { withScore: false });
    expect(Object.values(result.matches).length).toBe(matchCount);
    expect(result.score === 1).toBe(true);
  });

  test.each(testData)('%#. %s with %d matches (withRanges = true)', (what, matchCount, whereList) => {
    const result = matchList(what, whereList, { withScore: false, withRanges: true });
    expect(Object.values(result.matches).length).toBe(matchCount);
    expect(result.score === 1).toBe(true);
  });

  test.each(testData)('%#. %s with %d matches (withWrapper = <{?}>)', (what, matchCount, whereList) => {
    const result = matchList(what, whereList, { withScore: false, withWrapper: '<{?}>' });
    expect(Object.values(result.matches).length).toBe(matchCount);
    expect(result.score === 1).toBe(true);
  });

  test('should contain index and original', () => {
    const result = matchList('fuzzz', ['fu--', '---u----', '-z-', 'f----', '----fuz----zz']);
    expect(Object.values(result.matches).length).toBe(1);
    expect(Object.keys(result.matches)).toEqual(['4']);
    expect(Object.values(result.matches)).toEqual([{ score: 7.680000000000001, original: '----fuz----zz', index: 4 }]);
    expect(result.score).toBe(7.680000000000001);
  });

  test('should contain score as a mediane of scores', () => {
    const result = matchList('fuzzz', ['fu--zz.z', '---u----', '-z-', 'f----', '----fuz----zz']);
    expect(Object.values(result.matches).length).toBe(2);
    expect(Object.keys(result.matches)).toEqual(['0', '4']);
    expect(result.matches[0]).toEqual({ 'index': 0, 'original': 'fu--zz.z', 'score': 3.88 });
    expect(result.matches[4]).toEqual({ 'index': 4, 'original': '----fuz----zz', 'score': 7.680000000000001 });
    expect(result.score).toBe((3.88 + 7.680000000000001) / 2);
  });

  test('should contain score as a mediane of scores with rates', () => {
    const result = matchList('fuzzz', [{ value: 'fu--zz.z', rate: 0.5 }, '---u----', '-z-', 'f----', '----fuz----zz']);
    expect(Object.values(result.matches).length).toBe(2);
    expect(Object.keys(result.matches)).toEqual(['0', '4']);
    expect(result.matches[0]).toEqual({ index: 0, original: { value: 'fu--zz.z', rate: 0.5 }, score: 1.94 });
    expect(result.matches[4]).toEqual({ index: 4, original: '----fuz----zz', score: 7.680000000000001 });
    expect(result.score).toBe((1.94 + 7.680000000000001) / 2);
  });
});