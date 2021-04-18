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

  test('should return result for array', () => {
    const result = matchList(
      'fzz',
      [{ value: 'fuzza', rate: 0.75 }, { value: 'fuzzy', rate: 0.10 }]
    );
    expect(result).toEqual({
      score: 2.3708148148148145,
      matches: {
        0: { score: 2.3708148148148145, original: 'fuzza', rate: 0.75, index: 0 },
        1: { score: 17.78111111111111, original: 'fuzzy', rate: 0.10, index: 1 }
      }
    });
  });

  test('should return result for mixed array', () => {
    const result = matchList(
      'fzz',
      [{ value: 'fuzza', rate: 0.75 }, 'fuzzy']
    );
    expect(result).toEqual({
      score: 1.778111111111111,
      matches: {
        0: { score: 2.3708148148148145, original: 'fuzza', rate: 0.75, index: 0 },
        1: { score: 1.778111111111111, original: 'fuzzy', index: 1 }
      }
    });
  });

  test('should return result for array with rates as a separate list', () => {
    const result = matchList(
      'fzz',
      ['fuzza', 'fuzzy'],
      { rates: [0.75, 0.10] }
    );
    expect(result).toEqual({
      score: 2.3708148148148145,
      matches: {
        0: { score: 2.3708148148148145, original: 'fuzza', rate: 0.75, index: 0 },
        1: { score: 17.78111111111111, original: 'fuzzy', rate: 0.10, index: 1 }
      }
    });
  });

  test('should return result for array with rates as a separate object', () => {
    const result = matchList(
      'fzz',
      ['fuzza', 'fuzzy'],
      { rates: { 1: 0.10 } }
    );
    expect(result).toEqual({
      score: 1.778111111111111,
      matches: {
        0: { score: 1.778111111111111, original: 'fuzza', index: 0 },
        1: { score: 17.78111111111111, original: 'fuzzy', rate: 0.10, index: 1 }
      }
    });
  });

  test('should return result for array with rates as a separate object with string key', () => {
    const result = matchList(
      'fzz',
      ['fuzza', 'fuzzy'],
      { rates: { '1': 0.10 } }
    );
    expect(result).toEqual({
      score: 1.778111111111111,
      matches: {
        0: { score: 1.778111111111111, original: 'fuzza', index: 0 },
        1: { score: 17.78111111111111, original: 'fuzzy', rate: 0.10, index: 1 }
      }
    });
  });

  test('should return result for object', () => {
    const result = matchList(
      'fzz',
      { v1: { value: 'fuzza', rate: 0.75 }, v2: { value: 'fuzzy', rate: 0.10 } }
    );
    expect(result).toEqual({
      score: 2.3708148148148145,
      matches: {
        v1: { score: 2.3708148148148145, original: 'fuzza', rate: 0.75, index: 'v1' },
        v2: { score: 17.78111111111111, original: 'fuzzy', rate: 0.10, index: 'v2' }
      }
    });
  });

  test('should return result for combined object', () => {
    const result = matchList(
      'fzz',
      { v1: 'fuzza', v2: { value: 'fuzzy', rate: 0.10 } }
    );
    expect(result).toEqual({
      score: 1.778111111111111,
      matches: {
        v1: { score: 1.778111111111111, original: 'fuzza', index: 'v1' },
        v2: { score: 17.78111111111111, original: 'fuzzy', rate: 0.10, index: 'v2' }
      }
    });
  });

  test('should return result for object with separate rates', () => {
    const result = matchList(
      'fzz',
      { v1: 'fuzza', v2: 'fuzzy', v3: 'fazza' },
      { rates: { v2: 0.10 } },
    );
    expect(result).toEqual({
      score: 1.778111111111111,
      matches: {
        v1: { score: 1.778111111111111, original: 'fuzza', index: 'v1' },
        v2: { score: 17.78111111111111, original: 'fuzzy', rate: 0.10, index: 'v2' },
        v3: { score: 1.778111111111111, original: 'fazza', index: 'v3' },
      }
    });
  });

  test('should contain score as a min value of scores', () => {
    const result = matchList('fuzzz', ['fu--zz.z', '---u----', '-z-', 'f----', '----fuz----zz']);
    expect(Object.values(result.matches).length).toBe(2);
    expect(Object.keys(result.matches)).toEqual(['0', '4']);
    expect(result.matches[0]).toEqual({ 'index': 0, 'original': 'fu--zz.z', 'score': 3.8804 });
    expect(result.matches[4]).toEqual({ 'index': 4, 'original': '----fuz----zz', 'score': 7.680000000000001 });
    expect(result.score).toBe(3.8804);
  });

  test('should contain score as a min value of scores with rates', () => {
    const result = matchList('fuzzz', [{ value: 'fu--zz.z', rate: 0.5 }, '---u----', '-z-', 'f----', '----fuz----zz']);
    expect(Object.values(result.matches).length).toBe(2);
    expect(Object.keys(result.matches)).toEqual(['0', '4']);
    expect(result.matches[0]).toEqual({ index: 0, original: 'fu--zz.z', rate: 0.5, score: 7.7608 });
    expect(result.matches[4]).toEqual({ index: 4, original: '----fuz----zz', score: 7.680000000000001 });
    expect(result.score).toBe(7.680000000000001);
  });

  test('should ignore wrong rate', () => {
    const result = matchList('fuzzz', [{ value: 'fu--zz.z', rate: 999 }, '---u----', '-z-', 'f----', '----fuz----zz']);
    expect(Object.values(result.matches).length).toBe(2);
    expect(Object.keys(result.matches)).toEqual(['0', '4']);
    expect(result.matches[0]).toEqual({ index: 0, original: 'fu--zz.z', score: 3.8804 });
    expect(result.matches[4]).toEqual({ index: 4, original: '----fuz----zz', score: 7.680000000000001 });
    expect(result.score).toBe(3.8804);
  });

  test('should contain score as a min value of scores with rates for object', () => {
    const result = matchList('fuzzz', { v1: { value: 'fu--zz.z', rate: 0.5 }, v2: '---u----', v3: '-z-', v4: 'f----', v5: '----fuz----zz' });
    expect(Object.values(result.matches).length).toBe(2);
    expect(Object.keys(result.matches)).toEqual(['v1', 'v5']);
    expect(result.matches.v1).toEqual({ index: 'v1', original: 'fu--zz.z', rate: 0.5, score: 7.7608 });
    expect(result.matches.v5).toEqual({ index: 'v5', original: '----fuz----zz', score: 7.680000000000001 });
    expect(result.score).toBe(7.680000000000001);
  });
});