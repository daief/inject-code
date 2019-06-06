import { RouterLayout } from '@/components/options/RouterLayout';
import * as React from 'react';
import { hot } from 'react-hot-loader/root';
import { RematchWrap } from './store';

export const App: React.SFC = hot(() => {
  return (
    <RematchWrap>
      <RouterLayout />
    </RematchWrap>
  );
});
