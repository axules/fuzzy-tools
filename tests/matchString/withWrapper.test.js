import { matchString } from '../../src';

const testData = [
  ['fuz', 'fuzzy', '<{?}>', '<fuz>zy'],
  ['fuz', 'FuZZy', '<{?}>', '<FuZ>Zy'],
  ['fuz', 'fuzzy FUZ', '<{?}>', '<fuz>zy FUZ'],
  ['fuz', '-f-u-z-z-y-', '<{?}>', '-<f>-<u>-<z>-z-y-'],
  ['fuz', '-f-u-z-z-y-fuzzy', '<{?}>', '-<f>-<u>-<z>-z-y-fuzzy'],
  ['fuz', '--fuzzy', '[{?}]', '--[fuz]zy'],
  ['fuz', '--fuzzy', '[{}]', '--[{}]zy'],
  ['fuz', '--fuzzy', 'X', '--Xzy'],
  ['fuz', '--fuz--zy', (w) => `?${w}?`, '--?fuz?--zy'],
  ['fuz', '--fuz--zy', (w) => w.toUpperCase(), '--FUZ--zy'],
];

describe('matchString(..., { withWrapper: true }) = true', () => {
  test.each(testData)('%#. %s in %s, wrap into %j => %s', (what, where, wrapper, expected) => {
    expect(matchString(what, where, { withWrapper: wrapper }).wrapped)
      .toBe(expected);
  });
});