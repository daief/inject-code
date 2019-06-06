import { Home } from '@/options/Home';
import * as React from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import * as styles from './style.module.less';

const routes: Array<{
  name?: string;
  path: string;
  component: React.ComponentType;
}> = [
  {
    path: '/',
    component: Home,
  },
];

export const RouterLayout: React.SFC = () => {
  return (
    <div className={styles.wrap}>
      <div className={styles.left}>left</div>
      <div className={styles.right}>
        <Router>
          <Switch>
            {routes.map(r => (
              <Route exact key={r.path} path={r.path} component={r.component} />
            ))}
          </Switch>
        </Router>
      </div>
    </div>
  );
};
