import { matchString } from '../../src';

const testData = [
  ['fUz', ['fuz--', '--fuz', 'f--uz', 'fu--z', '-fuz-', 'f-u-z', 'xxfxxx-xxxuxxx-xxzxxxzzzz fu zzz']],
  ['fuzzy', ['Fuzzy fuz', 'Fuzzy fuz', 'fUzzy', 'FUZZY']],
  ['wOrD', ['word', 'WORD', 'it is WORd', 'What could I READ in weekend?']],
  [
    'vu80U581Q',
    [
      'vwl2 bj 0wt1i rm5u-2io 48kl4- 7 _4 mte9u0i 7v ur4yowf-jt5w x6hw6gt 6ihvmv 084ng1ji w99ikng_59 u7j63q ',
      'vu80u581q',
      '----v----u-80u58--1q---',
    ]
  ]
];

describe('matchString(..., { caseSensitive }) = true', () => {
  describe.each(testData)('%#. %s', (what, whereList) => {
    test.each(whereList)('%#. %s', (where) => {
      expect(!!matchString(what, where)).toBe(true);
      expect(!!matchString(what, where, { caseSensitive: true })).toBe(false);
    });
  });
});
