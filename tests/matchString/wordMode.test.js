import { matchString } from '../../src';

const testData = [
  [['fuz'], false,
    ['f uz--', '--fu1z', 'f--uz', 'fu--z', '-fu+z-', 'f-u-z', 'xxfxxx-xxxuxxx-xxzxxxzzzz fu zzz'],
  ],
  ['fuz', true,
    ['f uz--', '--fu1z', 'f--uz', 'fu--z', '-fu+z-', 'f-u-z', 'xxfxxx-xxxuxxx-xxzxxxzzzz fu zzz'],
  ],
  [['fuz', 'sea'], true, ['fuzzy search', 'it is fuzzy -> search library']],
  [['fuz', 'sea'], false, ['fu-zzy search', 'it is fuzzy -> se-arch library']],
  [['fuz', ' ', 'sea'], true, ['fuzzy search', 'it is fuzzy -> search library']],
  [['zzy', 'sea'], true, ['fu fuzzy search', 'it is fu fuzzy -> search library']],
  [['zzy', 'seaaa'], false, ['fu fuzzy search', 'it is fu fuzzy -> search library']],
];

const wrapperTestData = [
  [['fuzz'], 'fuz fu f fuzzy fuzzy', 'fuz fu f <fuzz>y fuzzy'],
  [['f', 'u', 'z', 'z', 'f'], 'fuz fu f fuzzy fuzzy', '<fuz> fu f fu<z>zy <f>uzzy'],
  [['fu', 'z', 'z', 'f'], 'fuz fu f fuzzy fuzzy', '<fuz> fu f fu<z>zy <f>uzzy'],
  [['f', 'uz', 'z', 'f'], 'fuz fu f fuzzy fuzzy', '<fuz> fu f fu<z>zy <f>uzzy'],
  [['f', 'uzz', 'f'], 'fuz fu f fuzzy fuzzy', '<f>uz fu f f<uzz>y <f>uzzy'],
  [[' ', ' ', 'f', 'uzz', 'f'], 'fuz fu f fuzzy fuzzy', 'fuz< >fu< f> f<uzz>y <f>uzzy'],
  [['fuz', 'uzz'], 'fu f fuzzy fuzzy', 'fu f <fuz>zy f<uzz>y'],
];

const rangesTestData = [
  [['fuzz'], 'fuz fu f fuzzy fuzzy', [{ begin: 9, end: 12 }]],
  [['f', 'u', 'z', 'z', 'f'], 'fuz fu f fuzzy fuzzy',
    [{ begin: 0, end: 2 }, { begin: 11, end: 11 }, { begin: 15, end: 15 }]
  ],
  [['fu', 'z', 'z', 'f'], 'fuz fu f fuzzy fuzzy',
    [{ begin: 0, end: 2 }, { begin: 11, end: 11 }, { begin: 15, end: 15 }]
  ],
  [['f', 'uz', 'z', 'f'], 'fuz fu f fuzzy fuzzy',
    [{ begin: 0, end: 2 }, { begin: 11, end: 11 }, { begin: 15, end: 15 }]
  ],
  [['f', 'uzz', 'f'], 'fuz fu f fuzzy fuzzy',
    [{ begin: 0, end: 0 }, { begin: 10, end: 12 }, { begin: 15, end: 15 }]
  ],
  [[' ', ' ', 'f', 'uzz'], 'fuz fu f fuzzy fuzzy',
    [{ begin: 3, end: 3 }, { begin: 6, end: 7 }, { begin: 10, end: 12 }]
  ],
  [['fuz', 'uzz'], 'fu f fuzzy fuzzy',
    [{ begin: 5, end: 7 }, { begin: 12, end: 14 }]
  ],
];

describe('matchString(...) with wordMode', () => {
  describe.each(testData)('%#. %s should be found(%j)', (what, expected, whereList) => {
    test.each(whereList)('%#. %s', (where) => {
      expect(!!matchString(what, where))
        .toBe(expected);
    });
  });

  describe('Should wrap full words', () => {
    it.each(wrapperTestData)('&#. %s in %s', (what, where, expected) => {
      const result = matchString(what, where, { withWrapper: '<{?}>' }).wrapped;
      expect(result).toBe(expected);
    });
  });

  describe('Should return ranges with full words', () => {
    it.each(rangesTestData)('&#. %s in %s', (what, where, expected) => {
      const result = matchString(what, where, { withRanges: true }).ranges;
      expect(result).toEqual(expected);
      const allChunks = result.map(({ begin, end }) => where.slice(begin, end + 1)).join('');
      expect(allChunks).toBe(what.join(''));
    });
  });

  describe('Should depends on caseSensitive', () => {
    const args = [['fuZ', 'Sea'], 'fUzzy seArch'];

    it('should be case sensitive', () => {
      const result = matchString(...args);
      expect(!!result).toBe(true);
    });

    it('should be case sensitive', () => {
      const result = matchString(...args, { caseSensitive: true });
      expect(!!result).toBe(false);
    });
  });
});