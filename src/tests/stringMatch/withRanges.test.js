import { matchString } from '../../matchString';

const testData = [
  ['fuz', 'fuzzy', [{ begin: 0, end: 2 }]],
  ['fuz', '-f-u-z-z-y-', [{ begin: 1, end: 1 }, { begin: 3, end: 3 }, { begin: 5, end: 5 }]],
  ['fuz', '---fuz', [{ begin: 3, end: 5 }]],
  ['fuz', '---f-uz', [{ begin: 3, end: 3 }, { begin: 5, end: 6 }]],
  ['fuz', '---fu-z', [{ begin: 3, end: 4 }, { begin: 6, end: 6 }]],
  ['fuz', '---fuz---', [{ begin: 3, end: 5 }]],
  ['fuz', '---fuzfuzfuz---', [{ begin: 3, end: 5 }]],
];

describe('matchString(..., { withRanges: true }) = true', () => {
  test.each(testData)('%#. %s in %s => %j', (what, where, expected) => {
    expect(matchString(what, where, { withRanges: true }).ranges)
      .toEqual(expected);
  });
});