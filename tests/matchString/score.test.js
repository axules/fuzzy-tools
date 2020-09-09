import { matchString } from '../../src';

const equalScoreData = [
  ['fuz', 0.001, ['fuz--', 'fuz', 'fuz----']],
  ['fuz', 2, ['--fuz--', '--fuz', '--fuz----']],
  ['fuz', 5.777777777777777, ['--f-u-z--', '--f-u-z', '--f-u-z----']],
  ['fuz', 4.444444444444444, ['-f-u-z--', '-f-u-z', '-f-u-z----']],
  ['fuz', 3.111444444444444, ['f-u-z--', 'f-u-z', 'f-u-z----']],
];

describe('Score test', () => {
  test.each(equalScoreData)('%#. %s with score %d, the same in %j', (what, score, where) => {
    const scoreList = where.map(el => matchString(what, el).score);
    expect(scoreList).toEqual(Array(where.length).fill(score));
  });
});