import { matchString } from '../../matchString';

const testData = [
  ['fuXXX???', ['fuz--', '--fuz', 'f--uz', 'fu--z', '-fuz-', 'f-u-z', 'xxfxxx-xxxuxxx-xxzxxxzzzz fu zzz']],
  [
    '!vu80u581q',
    [
      'vwl2 bj 0wt1i rm5u-2io 48kl4- 7 _4 mte9u0i 7v ur4yowf-jt5w x6hw6gt 6ihvmv 084ng1ji w99ikng_59 u7j63q ',
      'vu80u581q',
      '----v----u-80u58--1q---',
    ]
  ],
  ['', ['fuz--']],
  [null, ['fuz--']],
  [123, ['123--']],
  [{}, ['fuz--']],
  [[], ['fuz--']],
  [new Date(), ['fuz--']],
  ['zzz', ['', null, 123, {}, [], new Date()]],
];

describe('matchString(...) = true', () => {
  describe.each(testData)('%#. %s', (what, whereList) => {
    test.each(whereList)('%#. %s', (where) => {
      expect(!!matchString(what, where))
        .toBe(false);
      expect(!!matchString(what, where, { withScore: false }))
        .toBe(false);
    });
  });
});