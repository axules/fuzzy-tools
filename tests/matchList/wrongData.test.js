import { matchList } from '../../src';

const testData = [
  ['fuz', ['fu--', '---u----', '-z-', 'f----', '----fu------']],
  ['fuzzz', ['fu--']],
  ['', ['fu--']],
  [99, ['fu--']],
  [new Date(), ['fu--']],
  ['text', []],
  ['text', null],
  ['text', 'teeexxxxtttt'],
  [
    'vu80??u581q',
    [
      'vwl2 bj 0wt1i rm5u-2io 48kl4- 7 _4 mte9u0i 7v ur4yowf-jt5w x6hw6gt 6ihvmv 084ng1ji w99ikng_59 u7j63q ',
      'vu80u581q',
      '----v----u-80u58--1q---',
    ]
  ]
];

describe('matchList(...) = null', () => {
  test.each(testData)('%#. %s', (what, whereList) => {
    expect(matchList(what, whereList))
      .toBe(null);
    expect(matchList(what, whereList, { withScore: false }))
      .toBe(null);
  });
});