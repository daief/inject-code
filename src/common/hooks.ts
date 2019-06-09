import { useCallback, useReducer } from 'react';

type VoidFunction = () => void;

const reducer = (state: boolean, _action: null): boolean => !state;

// ref: https://raw.githubusercontent.com/CharlesStover/use-force-update/master/src/use-force-update.ts
export const useForceUpdate = (): VoidFunction => {
  const [, dispatch] = useReducer(reducer, true);

  // Turn dispatch(required_parameter) into dispatch().
  const memoizedDispatch = useCallback((): void => {
    dispatch(null);
  }, [dispatch]);
  return memoizedDispatch;
};
