import { FileSetWithRule, SOURCE_TYPE, STATUS } from '@/interfaces/entities';
import { AnyFunc } from '@/interfaces/utils';
import {
  Badge,
  Card,
  Col,
  Icon,
  List,
  Popconfirm,
  Row,
  Statistic,
  Switch,
} from 'antd';
import { BadgeProps } from 'antd/lib/badge';
import { Button } from 'antd/lib/radio';
import * as React from 'react';
import { useMappedState } from 'redux-react-hook';
import { useStore } from '../store';
import * as styles from './index.module.less';

const { useCallback } = React;

const mapState = () =>
  useCallback<
    AnyFunc<{
      fileSetList: FileSetWithRule[];
      listLoading: boolean;
    }>
  >(
    _ => ({
      fileSetList: _.all.fileSetList,
      listLoading: _.loading.effects.all.getFileSetList,
    }),
    [],
  );

export const Home: React.SFC = React.memo(() => {
  const { dispatch } = useStore();
  const { fileSetList, listLoading } = useMappedState(mapState());

  React.useEffect(() => {
    dispatch.all.getFileSetList();
  }, []);

  const handleSwitchStatusChange = (item: FileSetWithRule) => value => {
    dispatch.all.updateFileSet({
      id: item.id,
      status: value ? STATUS.ENABLE : STATUS.DISABLE,
    });
  };

  const hanldeDeleteItem = (item: FileSetWithRule) => () => {
    dispatch.all.deleteFileSet(item);
  };

  return (
    <>
      <List
        grid={{ gutter: 16, column: 4 }}
        dataSource={fileSetList}
        rowKey="id"
        loading={listLoading}
        renderItem={item => {
          const { sourceFileIds, ruleIds, status, name } = item;
          const badgeStatus = {
            [STATUS.DISABLE]: 'default',
            [STATUS.ENABLE]: 'processing',
          }[status] as BadgeProps['status'];
          return (
            <List.Item className={`${styles.item} ${badgeStatus}`}>
              <Card
                hoverable
                actions={[
                  <Switch
                    key="1"
                    checked={status === STATUS.ENABLE}
                    onChange={handleSwitchStatusChange(item)}
                  />,
                  <Icon key="2" type="edit" />,
                  <Popconfirm
                    key="3"
                    title={'Are you sure to delete?'}
                    okText={'Delete'}
                    okType="danger"
                    cancelText={'No'}
                    onConfirm={hanldeDeleteItem(item)}
                  >
                    <Icon type="delete" style={{ color: '#f5222d' }} />
                  </Popconfirm>,
                ]}
              >
                <Card.Meta
                  title={
                    <>
                      <Badge status={badgeStatus} style={{ margin: '0 3px' }} />
                      {name}
                    </>
                  }
                />
                <Row gutter={16} style={{ marginTop: 10 }}>
                  <Col span={12}>
                    <Statistic
                      title={'Code Files'}
                      value={sourceFileIds.length}
                      prefix={<Icon type="like" />}
                    />
                  </Col>
                  <Col span={12}>
                    <Statistic title={'Rules'} value={ruleIds.length} />
                  </Col>
                </Row>
              </Card>
            </List.Item>
          );
        }}
      />
    </>
  );
});
