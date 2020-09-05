# fuzzy-tools

1. [What is it?](#what-is-it)
2. [Installation](#installation)
3. [Match function](#match-function)
    - [Match in string](#match-in-string)
    - [Match in strings list](#match-in-strings-list)
4. [Filter function](#filter-function)
    - [Filter strings list](#filter-strings-list)
    - [Filter objects list](#filter-objects-list)
5. [Benchmark results](#benchmark-results)
6. [Tests](./tests)


## What is it?

It is **the fastest** functions for fuzzy matching and items filtering.

## Installation

```
npm install --save fuzzy-tools
```

## Match function

`match(mask, where, options):Object` - returns result of string matching. Returns object if `mask` matches `where` (e.g. 'fzz' in 'fuzzy'), null - if it is not ('fzza' in 'fuzzy').

#### [Tests cases for match](./tests/match)

#### [Tests cases for matchList](./tests/matchList)

#### [Tests cases for matchString](./tests/matchString)

### **Arguments**
| args | type | default | note |
| - | - | - | - |
| mask | string | no | string what you want to find (fzz) |
| where | string or array | no | destination string or array of strings |
| options | object | {...} | additional options |
|  |  |  |  |

- `mask` - String
- `where`
    - **String**: `score` is score of matching (score = score(match, where))
    - **array of strings**: `score` is sum of score of each string (score = (score(match, item[0]) + score(match, item[1])) / matchesCount),
    - **array of Object({ value: String, rate: Number })**: `score` is sum of score of each value * rate (score = (score(match, item[0].value) * item[0].rate + score(match, item[1].value) * item[1].rate + ...) / matchesCount)
- `options`
    - `caseInsensitive`: Boolean (default: true) - when it is true, then `FZZ` will be matched with `fuzzy`. Charcase will be ignored.
    - `withScore`: Boolean (default: true) - when it is true, then `score` will be computed for matched strings, else `score` will be 1.
    - `withWrapper`: String or Function (default: false) - when it is true, then result will contains `wrapped`. It is needed to render hightlited results.
        - **String**: template string, (e.g. `'<b>{?}</b>'`, `{?}` will be replaced by matched word. `fzz` in `fuzzy` => `'<b>f</b>u<b>zz</b>y'`.
        - **Function(word: String): String**, (e.g. `(word) => '<b>'+word+'</b>'`)
    - `withRanges`: Boolean (default: false) - when it is true, then result will contains `ranges`. It is array of Object({ begin: Number, end: Number }) with ranges of matched parts.

### **Result**

- `score` - from `0` to `infinity`, less is better. If `withScore` is false then `score` is `1`.

- `matches` - It will be if `where` is array. Object with results, key is index in `what` array, value will be `{ score: Number, [wrapped: String], [ranges: Array] }`.

- `wrapped` - contains wrapped original string or what `withWrapper` function returns. It is undefined if `withWrapper` is false.

- `ranges` - array with matched ranges `{ begin: Number, end: Number }`. It is undefined if `withRanges` is false.

```javascript
import { match } from 'fuzzy-tools';

match('fzz', 'fuzzy'); // { score: 1.74 }
match('fzz', ['fu', 'fuzza']) // { score: 1.74, matches: {1:{score: 1.74}} }
match('fzz', [{ value: 'fuzza', rate: 0.75 }, { value: 'fuzzy', rate: 0.10 }])
// { score: 1,479, matches: {0: {score: 1,305}, 1: {score: 0,174}} }
// score = (1.74 * 0.75 + 1.74 * 0.10) / 2

match('fzz', 'fuzzy', { withScore: false }); // { score: 1 }
match('fZZ', 'fuzzy', { caseInsensitive: false }); // null

match('fZZ', 'fuzzy', { withWrapper: '<i>{?}</i>' });
// { score: 1.74, wrapped: '<i>f</i>u<i>zz</i>y' }
match('fZZ', ['fuzzy'], { withWrapper: '<i>{?}</i>' });
// { score: 1.74, matches: {0: {score: 1.74, wrapped: '<i>f</i>u<i>zz</i>y', original: 'fuzzy'}}}

match('fZZ', 'fuzzy', { withWrapper: w => `<b>${w}</b>` });
// { score: 1.74, wrapped: '<b>f</b>u<b>zz</b>y' }
match('fZZ', ['fuzzy'], { withWrapper: w => `<b>${w}</b>` });
// { score: 1.74, matches: {0: {score: 1.74, wrapped: '<b>f</b>u<b>zz</b>y', original: 'fuzzy'}}}

match('fZZ', 'fuzzy', { withRanges: true });
// { score: 1.74, ranges: [{begin: 0, end: 0}, {begin: 2, end: 3}]}
match('fZZ', ['fuzzy'], { withRanges: true });
// { score: 1.74, matches: {0: {score: 1.74, ranges: [{begin: 0, end: 0}, {begin: 2, end: 3}], original: 'fuzzy'}}}
```

### Match in string

```javascript
import { match } from 'fuzzy-tools';
// or
// import { matchString } from 'fuzzy-tools';

match('fzz', 'fuzzy'); // { score: 1.74 }
match('fzz', 'fuzzy', { withScore: false }); // { score: 1 }
match('fZZ', 'fuzzy', { caseInsensitive: false }); // null

match('fZZ', 'fuzzy', { withWrapper: '<i>{?}</i>' });
// { score: 1.74, wrapped: '<i>f</i>u<i>zz</i>y' }

match('fZZ', 'fuzzy', { withWrapper: w => `<b>${w}</b>` });
// { score: 1.74, wrapped: '<b>f</b>u<b>zz</b>y' }

match('fZZ', 'fuzzy', { withRanges: true });
// { score: 1.74, ranges: [{begin: 0, end: 0}, {begin: 2, end: 3}]}
```

### Match in list of strings
```javascript
import { match } from 'fuzzy-tools';
// or
// import { matchList } from 'fuzzy-tools';

match('fzz', ['fu', 'fuzza'])
// { score: 1.74, matches: {1:{score: 1.74, original: 'fuzza'}} }

match('fzz', ['fu', 'fuzza'], { withScore: false });
// { score: 1, matches: {1:{score: 1, original: 'fuzza'}} }

match('fzz', [{ value: 'fuzza', rate: 0.75 }, { value: 'fuzzy', rate: 0.10 }])
// {
//    score: 0.7395,
//    matches: {
//      0: {score: 1.305, original: { value: 'fuzza', rate: 0.75 }},
//      1: {score: 0.174, original: { value: 'fuzzy', rate: 0.10 }}
//    }
//}
// score = (1.74 * 0.75 + 1.74 * 0.10) / 2

match('fZZ', ['fuzzy'], { caseInsensitive: false });
// null

match('fZZ', ['fuzzy'], { withWrapper: '<i>{?}</i>' });
// { score: 1.74, matches: {0: {score: 1.74, wrapped: '<i>f</i>u<i>zz</i>y', original: 'fuzzy'}}}

match('fZZ', ['fuzzy'], { withWrapper: w => `<b>${w}</b>` });
// { score: 1.74, matches: {0: {score: 1.74, wrapped: '<b>f</b>u<b>zz</b>y', original: 'fuzzy'}}}

match('fZZ', ['fuzzy'], { withRanges: true });
// { score: 1.74, matches: {0: {score: 1.74, ranges: [{begin: 0, end: 0}, {begin: 2, end: 3}], original: 'fuzzy'}}}
```

## Filter function
`filter(mask: String, items: Array, options: Object): Array` - returns list of matched items.

#### [Tests cases](./tests/filter)

### **Arguments**
| args | type | default | note |
| - | - | - | - |
| mask | string | no | string what you want to find (fzz) |
| items | array | no | items list |
| options | object | {...} | additional options |
|  |  |  |  |

- `mask` - String
- `where`
    - Array of Strings
    - Array of Objects
- `options`
    - `extract`: required to filter Array of Objects
        - *String: field name* - this field will be extrtacted to match with mask
        - *Array: fields names* - these fields will be extrtacted to match with mask, each field will have 1 as rate.
        - *Object: { fieldName: rateNumber }* - field name is key, rate is value.
        - *Function(item):String or Array* - function takes item and should return *String*, *Array of Strings* or *Array of Object({ value: String, rate: Number })*
    - `itemWrapper`: function(item, matchResult, { index: Number, result: Array }): any - function takes item and matchResult and should return value that will be pushed into result list. *If it returns empty value (false, null, undefined, '', 0), then it will not be pushed into result.*
    - `caseInsensitive`: Boolean (default: true) - when it is true, then `FZZ` will be matched with `fuzzy`. Charcase will be ignored.
    - `withScore`: Boolean (default: true) - when it is true, then `score` will be computed for matched strings, else `score` will be 1.
    - `withWrapper`: String or Function (default: false) - when it is true, then match result for each item will contain `wrapped`. It is needed to render hightlited results.
        - **String**: template string, (e.g. `'<b>{?}</b>'`, `{?}` will be replaced by matched word. `fzz` in `fuzzy` => `'<b>f</b>u<b>zz</b>y'`.
        - **Function(word: String): String**, (e.g. `(word) => '<b>'+word+'</b>'`)
    - `withRanges`: Boolean (default: false) - when it is true, then match result for each item will contain `ranges`. It is array of Object({ begin: Number, end: Number }) with ranges of matched parts.

### Filter strings list
```javascript
import { filter } from 'fuzzy-tools';

const data = ['fuzzy', 'fazzy', 'furry', 'funny', 'fuuuuuzzer'];
filter('fZZ', data);
// ['fuzzy', 'fazzy', 'fuuuuuzzer'];

filter('fZZ', data, { itemWrapper: item => item.toUpperCase() });
// ['FUZZY', 'FAZZY', 'FUUUUUZZER'];

filter('fZZ', data, { withWrapper: '<{?}>', itemWrapper: (item, match) => match.wrapped });
// ['<f>u<zz>y', '<f>a<zz>y', '<f>uuuuu<zz>er'];

filter('fZZ', data, { extract: (item) => item.slice(0, 4) });
// ['fuzzy', 'fazzy'];

filter('FZZ', data, { caseInsensitive: false });
// [];

filter('FZZ', data, { caseInsensitive: false, extract: item => item.toUpperCase() });
// ['fuzzy', 'fazzy', 'fuuuuuzzer'];
```

### Filter objects list
```javascript
import { filter } from 'fuzzy-tools';

const data = [{ v: 'fuzzy' }, { v: 'funny' }, { v: 'fuuuuuzzer'}];

filter('fZZ', data, { extract: 'v' });
// [{ v: 'fuzzy' }, { v: 'fuuuuuzzer'}];

filter('fZZ', data, { extract: 'vvv' });
// [];

filter('fZZ', data, { extract: 'v', itemWrapper: item => item.v });
// ['fuzzy', 'fuuuuuzzer'];

filter('fZZ', data, { extract: 'v', withWrapper: '<{?}>', itemWrapper: (item, m) => m.wrapped });
// ['<f>u<zz>y', '<f>uuuuu<zz>er'];

// if extract contains more than 1 field, then result of matching will contain matches array
filter('fZZ', data, {
    extract: ['v', 'v2'],
    withWrapper: '<{?}>',
    itemWrapper: (item, m) => m.matches[0].wrapped
});
// ['<f>u<zz>y', '<f>uuuuu<zz>er'];
```

## Benchmark results

soon