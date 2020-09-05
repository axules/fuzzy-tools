import { matchString } from '../../src';

const testData = [
  ['fuz', ['fuz--', '--fuz', 'f--uz', 'fu--z', '-fuz-', 'f-u-z', 'xxfxxx-xxxuxxx-xxzxxxzzzz fu zzz']],
  [123, ['123--', '--1-2-3--']],
  [12.99, ['12.99--', '--1-2-.-9-9']],
  [
    'vu80u581q',
    [
      'vwl2 bj 0wt1i rm5u-2io 48kl4- 7 _4 mte9u0i 7v ur4yowf-jt5w x6hw6gt 6ihvmv 084ng1ji w99ikng_59 u7j63q ',
      'vu80u581q',
      '----v----u-80u58--1q---',
    ]
  ]
];

describe('matchString(...) = true', () => {
  describe.each(testData)('%#. %s', (what, whereList) => {
    test.each(whereList)('%#. %s', (where) => {
      expect(!!matchString(what, where))
        .toBe(true);
      expect(!!matchString(what, where, { withScore: false }))
        .toBe(true);
    });
  });
});