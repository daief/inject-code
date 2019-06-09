import { Home } from '@/options/Home';
import { SetDetail } from '@/options/SetDetail';
import { Button, Icon, Layout, Menu } from 'antd';
import { createHashHistory } from 'history';
import * as React from 'react';
import { Link, Route, Router, Switch, withRouter } from 'react-router-dom';
import * as styles from './style.module.less';

export const hashHistory = createHashHistory();

const { Header, Content } = Layout;

interface RouteConfg {
  name?: string;
  path: string;
  component: React.ComponentType;
}

interface MenuConfig {
  name: string;
  path: string;
  icon?: string;
  render?: React.ComponentType;
  children?: MenuConfig[];
}

const routes: RouteConfg[] = [
  {
    path: '/',
    component: Home,
  },
  {
    path: '/set-detail',
    component: SetDetail,
  },
];

const menus: MenuConfig[] = [
  {
    name: 'home',
    path: '/',
  },
];

const CustomHeader = withRouter(({ history: h }) => {
  const { pathname } = h.location;
  const [selectedKeys, setSelectedKeys] = React.useState<string[]>([]);
  React.useEffect(() => {
    setSelectedKeys([pathname]);
  }, [pathname]);

  return (
    <Header className={styles.header}>
      <Menu
        theme="light"
        mode="horizontal"
        className={styles.menu}
        selectedKeys={selectedKeys}
      >
        {menus.map(function traverse(item) {
          const { name, path, icon, render: R, children } = item;
          const hasNotEmptyChildren = children && children.length;
          const defaultRenderText = (
            <>
              {icon && <Icon type={icon} />}
              {name}
            </>
          );
          const renderItem = R ? (
            <R />
          ) : hasNotEmptyChildren ? (
            defaultRenderText
          ) : (
            <Link to={path}>{defaultRenderText}</Link>
          );
          if (hasNotEmptyChildren) {
            return (
              <Menu.SubMenu key={`${path}-${name}`} title={renderItem}>
                {children.map(traverse)}
              </Menu.SubMenu>
            );
          }

          return <Menu.Item key={path}>{renderItem}</Menu.Item>;
        })}
      </Menu>
    </Header>
  );
});

export const RouterLayout: React.SFC = () => {
  return (
    <Router history={hashHistory}>
      <Layout className={styles.wrap}>
        <CustomHeader />
        <Content className={styles.content}>
          <Switch>
            {routes.map(r => (
              <Route exact key={r.path} path={r.path} component={r.component} />
            ))}
          </Switch>
        </Content>
      </Layout>
    </Router>
  );
};
