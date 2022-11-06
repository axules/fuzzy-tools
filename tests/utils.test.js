import { getValue, getDataExtractor, getRegExpWithFrom, searchIn, isFunction, isObject, isString, defaultOptions, DEFAULT_OPTIONS, isRegExp } from '../src/utils';

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
    const testCases = [
      [null, null],
      [[], null],
      [{}, null],
      ['f1', expect.any(Function)],
      [['f1', 'f2'], expect.any(Function)],
      [['f1'], expect.any(Function)],
      [{ f1: 0.5, f2: 0.3, f3: 0.2 }, expect.any(Function)],
      [{ f1: 1 }, expect.any(Function)],
    ];

    test.each(testCases)('%#. getDataExtractor(%j) = %j', (fields, expected) => {
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

describe('defaultOptions', () => {
  const testCases = [
    [null, DEFAULT_OPTIONS],
    [undefined, DEFAULT_OPTIONS],
    [{}, DEFAULT_OPTIONS],
    [{ a: 100 }, { ...DEFAULT_OPTIONS, a: 100 }],
    [{ caseSensitive: true }, { ...DEFAULT_OPTIONS, caseSensitive: true }],
  ];

  test.each(testCases)('%#. defaultOptions(%j) = %j', (value, expected) => {
    expect(defaultOptions(value)).toEqual(expected);
  });
});

describe('isFunction', () => {
  const testCases = [
    [() => null, true],
    [function () {}, true],
    [function a() {}, true],
    [isFunction, true],
    [Date.now, true],
    [Promise.resolve(10), false],
    [1, false],
    [false, false],
    [null, false],
  ];

  test.each(testCases)('%#. isFunction(%j) = %j', (value, expected) => {
    expect(isFunction(value)).toEqual(expected);
  });
});

describe('isObject', () => {
  const testCases = [
    [() => null, false],
    [function () {}, false],
    [function a() {}, false],
    [isFunction, false],
    [Date.now, false],
    [1, false],
    [false, false],
    [null, false],
    [undefined, false],
    [Promise.resolve(10), true],
    [{}, true],
    [[], true],
    [new Date(), true],
    [Math, true],
  ];

  test.each(testCases)('%#. isObject(%j) = %j', (value, expected) => {
    expect(isObject(value)).toEqual(expected);
  });
});

describe('isString', () => {
  const testCases = [
    [() => null, false],
    [function () {}, false],
    [function a() {}, false],
    [isFunction, false],
    [Date.now, false],
    [Promise.resolve(10), false],
    [1, false],
    [1.23, false],
    [false, false],
    [null, false],
    ['', true],
    ['123', true],
    ['1.23', true],
  ];

  test.each(testCases)('%#. isString(%j) = %j', (value, expected) => {
    expect(isString(value)).toEqual(expected);
  });
});

describe('isRegExp', () => {
  const testCases = [
    [() => null, false],
    [function () {}, false],
    [function a() {}, false],
    [isFunction, false],
    [Date.now, false],
    [Promise.resolve(10), false],
    [1, false],
    [1.23, false],
    [false, false],
    [null, false],
    ['[a]', false],
    ['/[a]/', false],
    [/[a]/, true],
    [/[a]/igs, true],
    [new RegExp('[a]', 'ig'), true],
  ];

  test.each(testCases)('%#. isRegExp(%s) = %j', (value, expected) => {
    expect(isRegExp(value)).toEqual(expected);
  });
});

describe('getRegExpWithFrom', () => {
  const testCases = [
    [/[a-z]/, undefined, /(.{0,}?)([a-z])/],
    [/[a-z]/, null, /(.{0,}?)([a-z])/],
    [/[a-z]/, 0, /(.{0,}?)([a-z])/],
    [/[a-z]/ig, undefined, /(.{0,}?)([a-z])/gi],
    [/[a-z]/, 7, /(.{7,}?)([a-z])/],
    [/[a-z]/g, 14, /(.{14,}?)([a-z])/g],
    [/[a-z]./i, 99, /(.{99,}?)([a-z].)/i],
    [/[a-z]./ig, 10, /(.{10,}?)([a-z].)/gi],
    [/[a-z]/, 1, /(.{1,}?)([a-z])/],
    // in nodejs /.[a-z]+/dmuyis != new RegExp('.[a-z]+', 'dmuyis')
    [/[1-9]/dmuyis, 10, new RegExp('(.{10,}?)([1-9])', 'dmyi')],
    [new RegExp('[a-z1-9]', 'dmuyis'), 0, new RegExp('(.{0,}?)([a-z1-9])', 'dmuyis')],
    [new RegExp('[a-z1-9]', 'gdmuyis'), 10, new RegExp('(.{10,}?)([a-z1-9])', 'gdmuyis')],
    [new RegExp('[a-z1-9]', 'gdmuyis'), null, new RegExp('(.{0,}?)([a-z1-9])', 'gdmuyis')],
  ];

  test.each(testCases)('%#. getRegExpWithFrom(%s, %j) = %s', (fields, from, expected) => {
    expect(getRegExpWithFrom(fields, from)).toEqual(expected);
  });

  test('nodejs returns different regexp', () => {
    expect(/.[a-z]/gdmyuis)
      .toEqual(new RegExp('(?:[\\0-\\uD7FF\\uE000-\\uFFFF]|[\\uD800-\\uDBFF][\\uDC00-\\uDFFF]|[\\uD800-\\uDBFF](?![\\uDC00-\\uDFFF])|(?:[^\\uD800-\\uDBFF]|^)[\\uDC00-\\uDFFF])[a-z\\u017F\\u212A]', 'gdmyi'));
  });
});

describe('searchIn', () => {
  const testCases = [
    ['a-b-c', '-', undefined, [1, '-']],
    ['a-b-c', '-', null, [1, '-']],
    ['a-b-c', '-', 0, [1, '-']],
    ['a-b-c', '-b-', 0, [1, '-b-']],
    ['a-b-c', '-b-', 3, [-1, '']],
    ['a-b-c', 'a', 0, [0, 'a']],
    ['a-b-c', 'a-', 0, [0, 'a-']],
    ['a-b-c', 'a', -1, [0, 'a']],
    ['a-b-c', '-', 2, [3, '-']],
    ['a-b-c', '-c', 2, [3, '-c']],
    ['a-b-c', '-', 3, [3, '-']],
    ['a-b+-c', '+', 2, [3, '+']],
    ['a-b+-c', '+', 2, ['a-b+-c'.indexOf('+', 2), '+']],

    ['a-b-c', /-/, undefined, [1, '-']],
    ['a-b-c', /-/, null, [1, '-']],
    ['a-b-c', /-/, 0, [1, '-']],
    ['a-b-c', /-b-/, 0, [1, '-b-']],
    ['a-b-c', /-b-/, 3, [-1, '']],
    ['a-b-c', /-c/, 0, [3, '-c']],
    ['a-b-c', /-/, 2, [3, '-']],
    ['a-b-c', /-/, 3, [3, '-']],
    ['a-b-c', /-/, 4, [-1, '']],
    ['a-b-c', /[abc]/, 0, [0, 'a']],

    ['a-b-c', /[-+%\s]/, undefined, [1, '-']],
    ['a-b-c', /[-+%\s]/, 2, [3, '-']],
    ['a-b+- %c', /[-+%\s]/, 6, [6, '%']],
    ['a-b+- %c', /[-+%\s]/, 7, [-1, '']],
    ['a-b+- %c', /[-+%\s]/, 2, [3, '+']],
    ['a-b+- %c', /[-+%\s]/, 3, [3, '+']],
    ['a-b+- %c', /[-+%\s]/, 2, ['a-b+- %c'.indexOf('+', 2), '+']],
    ['a-b+- %c', /[-+%\s]/, 0, [1, '-']],
    ['a-b+- %c', /[%\s]/, 0, [5, ' ']],
  ];

  test.each(testCases)('%#. searchIn(%s, %s, %j) = %j', (where, what, from, expected) => {
    expect(searchIn(where, what, from)).toEqual(expected);
  });
});
