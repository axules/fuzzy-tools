import { matchList } from '../../src';

const testData = [
  ['fuz', ['fuz--', '--fuz', 'f--uz', 'fu--z', '-fuz-', 'f-u-z', 'xxfxxx-xxxuxxx-xxzxxxzzzz fu zzz']],
  ['fuzzz', ['fu--', '---u----', '-z-', 'f----', '----fuz----zz']],
  ['fuzzz', ['', null, undefined, '----fuz----zz']],
  [
    'vu80u581q',
    [
      'vwl2 bj 0wt1i rm5u-2io 48kl4- 7 _4 mte9u0i 7v ur4yowf-jt5w x6hw6gt 6ihvmv 084ng1ji w99ikng_59 u7j63q ',
      'vu80u581q',
      '----v----u-80u58--1q---',
    ]
  ]
];

describe('matchList(...) = true', () => {
  test.each(testData)('%#. %s', (what, whereList) => {
    expect(!!matchList(what, whereList))
      .toBe(true);
    expect(!!matchList(what, whereList, { withScore: false }))
      .toBe(true);
  });
});