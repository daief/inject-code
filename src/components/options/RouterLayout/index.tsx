import { Home } from '@/options/Home';
import { Button, Icon, Layout, Menu } from 'antd';
import * as React from 'react';
import {
  HashRouter as Router,
  Link,
  Route,
  Switch,
  withRouter,
} from 'react-router-dom';
import * as styles from './style.module.less';

const { Header, Content, Footer } = Layout;

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
];

const menus: MenuConfig[] = [
  {
    name: 'home',
    path: '/',
  },
];

const CustomHeader = withRouter(({ history }) => {
  const { pathname } = history.location;
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
    <Router>
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
