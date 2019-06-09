// fix & extend some rematch types error
import { InsertCodeDB } from '@/datasource/indexeddb';
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
      $db: InsertCodeDB;
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
