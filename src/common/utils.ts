import { hashHistory } from '@/components/options/RouterLayout';
import { AnyFunc } from '@/interfaces/utils';
import qs from 'querystring';

export function removeIndex<T = any>(arr: T[], index: number): T[] {
  return index < 0 ? arr : [...arr.slice(0, index), ...arr.slice(index + 1)];
}

export const NEW_THING_ID_PREFIX_MARK = 'new___';

export const NEW_THING_ID_PREFIX_MARK_REGEX = new RegExp(
  `^${NEW_THING_ID_PREFIX_MARK}`,
  'i',
);

export function getHashQuery(
  k?: string,
): typeof k extends string ? string : Record<string, string> {
  const obj = qs.parse(hashHistory.location.search.replace(/^\?/, ''));
  // @ts-ignore
  return k ? obj[k] : obj;
}

export function updateHashQuery(obj: Record<string, string>) {
  const queryObj = qs.parse(hashHistory.location.search.replace(/^\?/, ''));
  // @ts-ignore
  const updateObj = new URLSearchParams({ ...queryObj, ...obj });
  hashHistory.replace(
    `${hashHistory.location.pathname}?${updateObj.toString()}`,
  );
}

export function invokeFunc<T = any>(fn: AnyFunc<T>, ...args: any[]): T {
  return fn(...args);
}
