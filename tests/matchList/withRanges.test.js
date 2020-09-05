import { matchList } from '../../src';

const testData = [
  ['fuz', ['fuz--', '--fuz'], [[{ begin: 0, end: 2 }], [{ begin: 2, end: 4 }]]],
  ['abc', ['--ab---c---'], [[{ begin: 2, end: 3 }, { begin: 7, end: 7 }]]],
];

describe('matchList(..., { withRanges: true }).ranges', () => {
  test.each(testData)('%#. %s', (what, whereList, expected) => {
    const result = matchList(what, whereList, { withRanges: true });
    expect(Object.values(result.matches).length).toBe(whereList.length);
    const ranges = Object.values(result.matches).map(el => el.ranges);
    expect(ranges).toEqual(expected);
  });

  test.each(testData)('%#. %s / withScore = false', (what, whereList, expected) => {
    const result = matchList(what, whereList, { withRanges: true, withScore: false });
    expect(Object.values(result.matches).length).toBe(whereList.length);
    const ranges = Object.values(result.matches).map(el => el.ranges);
    expect(ranges).toEqual(expected);
  });
});