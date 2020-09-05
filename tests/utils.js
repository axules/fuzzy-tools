function getRandom(a, b) {
  return Math.round(Math.random() * (b - a)) + a;
}

function generateWord(len) {
  const abc = 'qwertyu1io2pa3sd4fg5hj6kl7zx8cv9bnm0-_';
  return Array(len)
    .fill('*')
    .map(() => abc[getRandom(0, abc.length)])
    .join('');
}

function generateFuzzyWord(text) {
  const len = text.length;
  let what = '';
  for (
    let i = getRandom(0, 20);
    i < len;
    i = getRandom(i + 1, i + 20)
  ) {
    what += text[i] || '';
  }
  return what;
}

function generatePair(len = 256) {
  let where = '';
  let l = 0;

  for (let i = len; i > 0; i = len - where.length) {
    l = Math.min(i, getRandom(0, 15));
    where += generateWord(l) + ' ';
  }
  where = where.slice(0, len);

  return { what: generateFuzzyWord(where), where };
}

export function generateTrueCases(count = 100, len = 250) {
  return Array(count)
    .fill('')
    .map(() => generatePair(len));
}

export function generateWrongCases(count, len) {
  return generateTrueCases(count, len)
    .map((el) => Object.assign(el, { what: el.what + '???' }));
}