/* eslint-disable no-console */
import { matchString } from '../../matchString';
import { generateTrueCases, generateWrongCases } from '../utils';

const COUNT = 3000;
const LEN = 1000;

const trueCases = generateTrueCases(COUNT, LEN).map(({ what, where }) => [what, where]);
const wrongCases = generateWrongCases(COUNT, LEN).map(({ what, where }) => [what, where]);

describe(`Random [count is ${COUNT}, length is ${LEN}]`, () => {
  describe('TRUE cases', () => {
    test.each(trueCases)('fuzzyMatchString(...) === true', (what, where) => {
      const result = matchString(what, where);
      if (!result) console.log(what, '\r\n', where);
      expect(!!result).toBe(true);
    });
  });

  describe('WRONG cases', () => {
    test.each(wrongCases)('fuzzyMatchString(...) === false', (what, where) => {
      const result = matchString(what, where);
      if (result) console.log(what, '\r\n', where, '\r\n', result);
      expect(!!result).toBe(false);
    });
  });
});