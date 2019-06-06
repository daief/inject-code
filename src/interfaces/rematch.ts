// fix & extend some rematch types error
import { IDatasource } from '@/datasource/api';
import {
  Action,
  ModelConfig as LibModelConfig,
  ModelReducers,
  RematchDispatch,
} from '@rematch/core';

export interface ModelEffects {
  [key: string]: (
    payload: any,
    rootState: any,
    mate: {
      $db: IDatasource;
    },
  ) => void;
}

export interface ModelConfig<S = any, SS = S> {
  name?: string;
  state: S;
  baseReducer?: (state: SS, action: Action) => SS;
  reducers?: ModelReducers<S>;
  effects?: ModelEffects | ((dispatch: RematchDispatch) => ModelEffects);
}

export function extendModel<S>(m: ModelConfig<S>): LibModelConfig {
  // @ts-ignore
  return m;
}
