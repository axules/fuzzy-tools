import { getValue, getDataExtractor } from '../src/utils';

describe('getValue', () => {
  const data = [
    [null, 'aaa', undefined],
    [undefined, 'aaa', undefined],

    [{}, 'aaa', undefined],
    [[], 'aaa', undefined],

    [{ 0: 10 }, undefined, { 0: 10 }],
    [{ 0: 10 }, [], { 0: 10 }],
    [{ 0: 10 }, 0, 10],

    [{ a: 10 }, 'a', 10],
    [{ a: 10 }, 'a1', undefined],
    [{ a1: { child: 0.99 } }, 'a1.child.child2', undefined],
    [{ a: { b: 10 }, a2: 1 }, 'a', { b: 10 }],
    [{ a: { b: 10 }, a2: 1 }, ['a'], { b: 10 }],
    [{ a: { b: 10 }, a2: 1 }, 'a.b', 10],
    [{ a: { b: 10 }, a2: 1 }, ['a','b'], 10],
    [{ a: { b: [1,2,3,4] } }, 'a.b', [1,2,3,4]],
    [{ a: { b: [1,2,3,4] } }, 'a.b.2', 3],
    [{ a: { b: [1,2,3,4] } }, 'a.b.88', undefined],
    [{ a: { b: [1,2,3,{ c: [7,8,9] }] } }, 'a.b.3', { c: [7,8,9] }],
    [{ a: { b: [1,2,3,{ c: [7,8,9] }] } }, 'a.b.3.c', [7,8,9]],
    [{ a: { b: [1,2,3,{ c: [7,8,9] }] } }, 'a.b.3.c.2', 9],
    [{ a: { b: [1,2,3,{ c: [7,8,9] }] } }, 'a.b.3.c.3', undefined],
    [{ a: { b: [1,2,3,{ c: [7,8,9] }] } }, 'a.b.3.cc.2', undefined],
    [{ a: { b: [1,2,3,{ c: [7,8,9] }] } }, 'a.bb.3.c.2', undefined],
    [{ a: { b: [1,2,3,{ c: [7,8,9] }] } }, 'a.b.99.c.2', undefined],
    [{ a: { b: [1,2,3,{ c: [7,8,9] }] } }, 'aaa.b.3.c.2', undefined],
  ];

  test.each(data)('%#. getValue(%j, %j) = %j', (obj, key, expected) => {
    expect(getValue(obj, key, expected)).toEqual(expected);
  });
});

describe('getDataExtractor', () => {
  function makeField(k, v, rate) {
    return {
      rate: parseFloat(rate) || 1,
      field: Array.isArray(k) ? k.join('.') : k,
      path: k,
      value: v,
    };
  }
  describe('should return null or function', () => {
    const resultData = [
      [null, null],
      [[], null],
      [{}, null],
      ['f1', expect.any(Function)],
      [['f1', 'f2'], expect.any(Function)],
      [['f1'], expect.any(Function)],
      [{ f1: 0.5, f2: 0.3, f3: 0.2 }, expect.any(Function)],
      [{ f1: 1 }, expect.any(Function)],
    ];

    test.each(resultData)('%#. getDataExtractor(%j) = %j', (fields, expected) => {
      expect(getDataExtractor(fields)).toEqual(expected);
    });
  });

  describe('getDataExtractor(...)(v) should return field with value', () => {
    const extractorData = [
      [['f1', 'f2'], { f1: 'aa', f2: 'bb', f3: 'cc' }, { f1: 'aa', f2: 'bb' }],
      [['f1'], { f1: 'aa', f2: 'bb', f3: 'cc' }, { f1: 'aa' }],
      ['f1', { f1: 'aa', f2: 'bb', f3: 'cc' }, 'aa'],
      ['f1.a.2', { f1: { a: ['aa', 'bb', 'cc'] } }, 'cc'],
      ['f1.a.2', {}, undefined],
      ['f1.a.2', null, undefined],
      ['f1.aaa.2', { f1: { a: ['aa', 'bb', 'cc'] } }, undefined],
      [{ f2: 'zzzz' }, { f1: 'aa', f2: 'bb' }, { f2: 'bb' }],
      [{ f2: 99 }, { f1: 'aa', f2: 'bb' }, { f2: makeField('f2', 'bb', 99) }],
      [{ f2: 1.2 }, { f1: 'aa', f2: 'bb' }, { f2: makeField('f2', 'bb', 1.2) }],
      [{ f2: 0.7, f1: 0.3 }, { f1: 'aa', f2: 'bb' }, { f2: makeField('f2', 'bb', 0.7), f1: makeField('f1', 'aa', 0.3) }],
    ];

    test.each(extractorData)('%#. getDataExtractor(%j)(%j)', (fields, value, expected) => {
      expect(getDataExtractor(fields)(value)).toEqual(expected);
    });
  });
});
