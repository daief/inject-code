import { Plugin } from '@rematch/core';

export function createInjectCtxPlugin(
  opts: {
    injected?: {
      [k: string]: any;
    };
  } = {},
): Plugin {
  const injected = opts.injected || {};
  const keys = Object.keys(injected);
  return {
    // tslint:disable-next-line: variable-name
    middleware: _store => next => action => {
      action.meta = {
        ...action.meta,
      };

      keys.forEach(key => {
        action.meta[key] = injected[key];
      });

      action.meta = {
        ...action.meta,
      };

      return next(action);
    },
  };
}
