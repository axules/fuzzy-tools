import { isString } from './utils';
import { matchString as _matchString } from './matchString';
import { matchList as _matchList } from './matchList';

export function match(what, where, options) {
  if (!what || !where || !isString(what)) {
    return null;
  }
  return Array.isArray(where)
    ? _matchList(what, where, options)
    : _matchString(what, where, options);
}

export const matchString = _matchString;
export const matchList = _matchList;

export default {
  match,
  matchString: _matchString,
  matchList: _matchList
};