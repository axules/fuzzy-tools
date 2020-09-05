import { matchList } from '../../src';

const testData = [
  ['fuz', ['fuz--', '--fuz'], '<{?}>', ['<fuz>--', '--<fuz>']],
  ['abc', ['--ab---c---', 'a-b-c'], (w) => `[${w}]`,['--[ab]---[c]---', '[a]-[b]-[c]']],
];

describe('matchList(..., { withWrapper }).wrapped', () => {
  test.each(testData)('%#. %s', (what, whereList, wrapper, expected) => {
    const result = matchList(what, whereList, { withWrapper: wrapper });
    expect(Object.values(result.matches).length).toBe(whereList.length);
    const wrapped = Object.values(result.matches).map(el => el.wrapped);
    const original = Object.values(result.matches).map(el => el.original);
    expect(wrapped).toEqual(expected);
    expect(original).toEqual(whereList);
  });

  test.each(testData)('%#. %s / withScore = false', (what, whereList, wrapper, expected) => {
    const result = matchList(what, whereList, { withWrapper: wrapper, withScore: false });
    expect(Object.values(result.matches).length).toBe(whereList.length);
    const wrapped = Object.values(result.matches).map(el => el.wrapped);
    expect(wrapped).toEqual(expected);
  });
});