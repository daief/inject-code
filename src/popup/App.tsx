import { RematchWrap } from '@/options/store';
import * as React from 'react';
import { hot } from 'react-hot-loader/root';
import { MatchedSetList } from './MatchedSetList';
import { Top } from './Top';

export const App: React.SFC = hot(() => {
  return (
    <RematchWrap>
      <Top />
      <MatchedSetList />
    </RematchWrap>
  );
});
