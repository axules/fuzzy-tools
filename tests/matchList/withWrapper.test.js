import { matchList } from '../../src';

const testData = [
  ['fuz', ['fuz--', '--fuz'], '<{?}>', ['<fuz>--', '--<fuz>'], ['0', '1']],
  ['abc', ['--ab---c---', 'a-b-c'], (w) => `[${w}]`, ['--[ab]---[c]---', '[a]-[b]-[c]'], ['0', '1']],
  ['abz', { f1: '--ab---z---', f2: 'a-b-z' }, (w) => `[${w}]`, ['--[ab]---[z]---', '[a]-[b]-[z]'], ['f1', 'f2']],
];

describe('matchList(..., { withWrapper }).wrapped', () => {
  test.each(testData)('%#. %s', (what, whereList, wrapper, expected) => {
    const result = matchList(what, whereList, { withWrapper: wrapper });
    expect(Object.values(result.matches).length).toBe(Object.values(whereList).length);
    const wrapped = Object.values(result.matches).map(el => el.wrapped);
    const original = Object.values(result.matches).map(el => el.original);
    expect(wrapped).toEqual(expected);
    expect(original).toEqual(Object.values(whereList));
  });

  test.each(testData)('%#. %s / withScore = false', (what, whereList, wrapper, expected, expectedKeys) => {
    const result = matchList(what, whereList, { withWrapper: wrapper, withScore: false });
    expect(Object.values(result.matches).length).toBe(Object.values(whereList).length);
    const wrapped = Object.values(result.matches).map(el => el.wrapped);
    expect(wrapped).toEqual(expected);
    expect(Object.keys(result.matches)).toEqual(expectedKeys);
  });
});