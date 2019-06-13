import { hashHistory } from '@/components/hashHistory';
import {
  EXTENSION_GLOBAL_OPTIONS_KEY,
  ExtensionGlobalOptions,
  MATCH_TYPE,
  Rule,
  STATUS,
} from '@/interfaces/entities';
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

export function checkRuleListIsMatched(
  url: URL,
  ruleList: Rule[],
  opts: {
    checkStatus?: boolean;
  } = {},
): boolean {
  const { checkStatus } = { checkStatus: true, ...opts };
  let flag = false;
  // as long as one rule is matched, make it matched
  for (const rule of ruleList) {
    const { regexContent, status, matchType } = rule;
    const statusPass = checkStatus ? status === STATUS.ENABLE : true;
    if (statusPass && regexContent) {
      const regex = new RegExp(regexContent, 'i');
      switch (matchType) {
        case MATCH_TYPE.ALL:
          flag = regex.test(url.href);
          break;
        case MATCH_TYPE.DOMAIN:
          flag = regex.test(url.hostname);
          break;
      }
      if (flag) {
        break;
      }
    }
  }
  return flag;
}

const DEFAULT_OPTIONS: ExtensionGlobalOptions = {
  [EXTENSION_GLOBAL_OPTIONS_KEY.status]: STATUS.ENABLE,
  [EXTENSION_GLOBAL_OPTIONS_KEY.popupTipForRefresh]: true,
  [EXTENSION_GLOBAL_OPTIONS_KEY.version]: DEFINE.version,
};
export const EXTENSION_GLOBAL_OPTIONS_STORAGE_KEY =
  '__EXTENSION_GLOBAL_OPTIONS_STORAGE_KEY__';
export function getGlobalOptions(
  key: EXTENSION_GLOBAL_OPTIONS_KEY,
): ExtensionGlobalOptions[typeof key];
export function getGlobalOptions(): ExtensionGlobalOptions;
export function getGlobalOptions(key?: EXTENSION_GLOBAL_OPTIONS_KEY) {
  let obj = {};
  try {
    obj = JSON.parse(
      localStorage.getItem(EXTENSION_GLOBAL_OPTIONS_STORAGE_KEY),
    );
  } catch (_) {
    /* */
  }
  obj = { ...DEFAULT_OPTIONS, ...obj };
  return key ? obj[key] : obj;
}

export function setGlobalOptions(opts: Partial<ExtensionGlobalOptions>) {
  const obj = getGlobalOptions();
  localStorage.setItem(
    EXTENSION_GLOBAL_OPTIONS_STORAGE_KEY,
    JSON.stringify({
      ...obj,
      ...opts,
    }),
  );
}

export function checkIsMobile() {
  return document.body.clientWidth < 768;
}
