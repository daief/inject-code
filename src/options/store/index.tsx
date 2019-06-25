import { InjectCodeDB } from '@/datasource/indexeddb';
import { init, RematchStore } from '@rematch/core';
import createLoadingPlugin from '@rematch/loading';
import * as React from 'react';
import { StoreContext } from 'redux-react-hook';
import { all } from './all';
import { background } from './background';
import { options } from './options';
import { createInjectCtxPlugin } from './plugins/injectCtx';
import { popup } from './popup';

const models = {
  all,
  background,
  options,
  popup,
};

type IDispatch =
  | { [k in keyof typeof models]: any } & Record<string, any>
  | ((payload: any) => any);

export const store: RematchStore & {
  // rewrite dispatch type to any
  dispatch: IDispatch;
} = init({
  models,
  plugins: [
    createInjectCtxPlugin({
      injected: {
        $db: InjectCodeDB.getInstance(),
      },
    }),
    createLoadingPlugin({}),
  ],
});

export const RematchWrap: React.SFC = ({ children }) => (
  <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
);

export const useStore = (): typeof store & {
  // avoid `An argument for 'action' was not provided` when call dispatch without param
  dispatch: IDispatch;
} => {
  return React.useContext(StoreContext);
};
