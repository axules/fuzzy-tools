import { match , matchString , matchList } from '../../src';

jest.mock('../../src/matchString', () => {
  return {
    __esModule: true,
    matchString: jest.fn(() => null),
  };
});
jest.mock('../../src/matchList', () => {
  return {
    __esModule: true,
    matchList: jest.fn(() => null),
  };
});

describe('match', () => {
  afterEach(() => {
    matchString.mockClear();
    matchList.mockClear();
  });

  test('should call matchString', () => {
    const options = { opt1: 10 };
    match('fuz', 'fuzzy', options);
    expect(matchString).toHaveBeenCalledTimes(1);
    expect(matchString).toHaveBeenLastCalledWith('fuz', 'fuzzy', options);
    expect(matchList).toHaveBeenCalledTimes(0);
  });

  test('should call matchList', () => {
    const options = { opt1: 10 };
    const strings = ['a', 'b'];
    match('fuz', strings, options);
    expect(matchList).toHaveBeenCalledTimes(1);
    expect(matchList).toHaveBeenLastCalledWith('fuz', strings, options);
    expect(matchString).toHaveBeenCalledTimes(0);
  });

  test('should call matchList for object', () => {
    const options = { opt1: 10 };
    const strings = { f1: 'a', f2: 'b' };
    match('fuz', strings, options);
    expect(matchList).toHaveBeenCalledTimes(1);
    expect(matchList).toHaveBeenLastCalledWith('fuz', strings, options);
    expect(matchString).toHaveBeenCalledTimes(0);
  });

  test('should call nothing', () => {
    match('fuz', null);
    match('fuz', '');
    match('', 'lalala');
    match(null, 'lalala');
    expect(matchList).toHaveBeenCalledTimes(0);
    expect(matchString).toHaveBeenCalledTimes(0);
  });
});
