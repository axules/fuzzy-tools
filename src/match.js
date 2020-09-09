import { matchString } from './matchString';
import { matchList } from './matchList';
import { isObject } from './utils';

export function match(what, where, options) {
  if (!what || !where) {
    return null;
  }
  return Array.isArray(where) || isObject(where)
    ? matchList(what, where, options)
    : matchString(what, where, options);
}