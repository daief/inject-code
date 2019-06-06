import * as React from 'react';
import { useMappedState } from 'redux-react-hook';
import { useStore } from '../store';

const { useCallback } = React;

export const Home: React.SFC = React.memo(() => {
  const { dispatch } = useStore();
  const state = useMappedState(
    useCallback(
      _ => ({
        fileSetList: _.all.fileSetList,
      }),
      [],
    ),
  );
  React.useEffect(() => {
    dispatch.all.getFileSetList();
  }, []);
  return <div>home</div>;
});
