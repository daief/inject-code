import { getInstance } from '@/datasource/api';
import { init, RematchStore } from '@rematch/core';
import createLoadingPlugin from '@rematch/loading';
import * as React from 'react';
import { StoreContext } from 'redux-react-hook';
import { all } from './all';
import { background } from './background';
import { createInjectCtxPlugin } from './plugins/injectCtx';

const models = {
  all,
  background,
};

type IDispatch = { [k in keyof typeof models]: any } | ((payload: any) => any);

export const store: RematchStore & {
  // rewrite dispatch type to any
  dispatch: IDispatch;
} = init({
  models,
  plugins: [
    createInjectCtxPlugin({
      injected: {
        $db: getInstance(),
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
