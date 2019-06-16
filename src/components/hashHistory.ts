import { createHashHistory } from 'history';
export const hashHistory = createHashHistory();
import qs from 'querystring';

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
