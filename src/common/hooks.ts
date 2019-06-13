import { AnyFunc } from '@/interfaces/utils';
import { useCallback, useEffect, useReducer, useState } from 'react';
import { checkIsMobile } from './utils';

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

export const useDebounce = (fn: AnyFunc, ms: number = 0, args: any[] = []) => {
  useEffect(() => {
    const handle = setTimeout(fn.bind(null, args), ms);

    return () => {
      clearTimeout(handle);
    };
  }, args);
};

export function useMobile() {
  const [isMobile, setIsMobile] = useState(checkIsMobile());
  const [w, setW] = useState(document.body.clientWidth);

  useDebounce(
    () => {
      setIsMobile(checkIsMobile());
    },
    700,
    [w],
  );

  useEffect(() => {
    const handleResize = () => {
      setW(document.body.clientWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return isMobile;
}
