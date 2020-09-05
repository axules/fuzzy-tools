import { matchString } from './matchString';
import { matchList } from './matchList';

export function match(what, where, options) {
  if (!what || !where) {
    return null;
  }
  return Array.isArray(where)
    ? matchList(what, where, options)
    : matchString(what, where, options);
}