import { filter } from '../../src';

describe('filter', () => {
  test('should return empty list', () => {
    const emptyData = [['', [1,2]], [null, [1,2]], ['sss', ''], ['sss', []], ['sss', 112312], ['fuz1', ['fuz-', 'f-u-z']]];
    emptyData.forEach(([why, where]) => {
      expect(filter(why, where)).toEqual([]);
    });
  });

  test('should return filtered string list', () => {
    const items = ['fuz', 'string', 'fuz2'];
    expect(filter('fuz', items)).toEqual(['fuz', 'fuz2']);
  });

  test('should return filtered string list with wrapped items', () => {
    const items = ['fuz', 'string', 'fauz2'];
    expect(filter('fuz', items, { withWrapper: '<{?}>', itemWrapper: (_, m) => m.wrapped }))
      .toEqual(['<fuz>', '<f>a<uz>2']);
  });

  test('should return filtered string list with extract and caseInsensitive=false', () => {
    const items = ['fuz', 'string', 'fuz2'];
    expect(filter('FUZ', items, { caseInsensitive: false })).toEqual([]);
    expect(filter('FUZ', items, { caseInsensitive: false, extract: item => item.toUpperCase() }))
      .toEqual(['fuz', 'fuz2']);
  });

  test('should return empty list, itemWrapper returns null', () => {
    const items = ['fuz', 'string', 'fuz2'];
    expect(filter('fuz', items, { itemWrapper: () => null })).toEqual([]);
  });

  test('should return filtered list, extract is string', () => {
    const items = [{ value: '---f-u-z' }, { value: 'string' }, { value: 'fuz' }];
    expect(filter('fuZ', items, { extract: 'value' })).toEqual([{ value: '---f-u-z' }, { value: 'fuz' }]);
  });

  test('should return filtered list with wrapped, extract is string', () => {
    const items = [{ value: '---f-u-z' }, { value: 'string' }, { value: 'fuz' }];
    expect(filter('fuZ', items, { extract: 'value', withWrapper: '<{?}>', itemWrapper: (el, m) => ({ ...el, w: m.wrapped }) }))
      .toEqual([{ value: '---f-u-z', w: '---<f>-<u>-<z>' }, { value: 'fuz', w: '<fuz>' }]);
  });

  test('should return filtered list with wrapped, extract is array', () => {
    const items = [{ v: '---f-u-z' }, { v: 'string', v2: 'ffuuzz' }, { v: 'fuz' }];
    expect(filter('fuZ', items, {
      extract: ['v', 'v2'],
      withWrapper: '<{?}>',
      itemWrapper: (el, { matches: m }) => ({ v: (m[0]||m[1]).wrapped })
    }))
      .toEqual([{ v: '---<f>-<u>-<z>' }, { v: '<f>f<u>u<z>z' }, { v: '<fuz>' }]);
  });

  test('should return empty list, extract is string and undefined', () => {
    const items = [{ value: '---f-u-z' }, { value: 'string' }, { value: 'fuz' }];
    expect(filter('fuZ', items, { extract: 'key' })).toEqual([]);
  });

  test('should return filtered list with string extract for deep field', () => {
    const items = [{ data: { v: '---Ffff-u-z' } }, { value: 'string' }];
    expect(filter('fuZ', items, { extract: 'data.v' })).toEqual([{ data: { v: '---Ffff-u-z' } }]);
  });

  test('should return filtered list with function extract', () => {
    const items = [{ v: '---f-u-z' }, { v: 'string' }, { v: 'fuZ' }];
    expect(filter('fUz', items, { extract: el => el.v })).toEqual([{ v: '---f-u-z' }, { v: 'fuZ' }]);
  });

  test('should return filtered object list with object extract', () => {
    const items = [{ v1: '---f-u-z' }, { v1: 'string' }, { v2: 'fuZ' }];
    expect(filter('fUz', items, { extract: { v1: 1, v2: 2 } })).toEqual([{ v1: '---f-u-z' }, { v2: 'fuZ' }]);
  });

  test('should return filtered and wrapped list', () => {
    const items = [{ v1: '---f-u-z' }, { v1: 'string' }, { v2: 'fuZ' }];
    expect(filter('fUz', items, { extract: { v1: 1, v2: 2 }, itemWrapper: (el, match) => ({ v: el.v1 || el.v2, score: match.score }) }))
      .toEqual([{ v: '---f-u-z', score: 7.11111111111111 }, { v: 'fuZ', score: 0 }]);
  });
});