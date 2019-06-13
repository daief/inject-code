import { hashHistory } from '@/components/hashHistory';
import { PopconfirmDelete } from '@/components/PopconfirmDelete';
import { ToggleStatus } from '@/components/ToggleStatus';
import { FileSetWithRule, ID, STATUS } from '@/interfaces/entities';
import { AnyFunc } from '@/interfaces/utils';
import { Badge, Card, Col, Icon, List, Row, Statistic } from 'antd';
import { BadgeProps } from 'antd/lib/badge';
import * as React from 'react';
import { useMappedState } from 'redux-react-hook';
import { useStore } from '../store';
import * as styles from './index.module.less';
import { TopBar } from './TopBar';

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

  const handleSwitchStatusChange = (item: FileSetWithRule) => value => {
    dispatch.all.updateFileSet({
      id: item.id,
      status: value,
    });
  };

  const hanldeDeleteItem = (item: FileSetWithRule) => () => {
    dispatch.all.deleteFileSet(item);
  };

  const pushToDetail = (id: ID) => () => {
    hashHistory.push(`/set-detail?id=${id}`);
  };

  return (
    <>
      <TopBar />
      <List
        style={{ marginTop: 16 }}
        grid={{ gutter: 16, md: 4, sm: 2, xs: 1 }}
        dataSource={fileSetList}
        rowKey="id"
        loading={listLoading}
        renderItem={item => {
          const { id, sourceFileIds, ruleIds, status, name } = item;
          const badgeStatus = {
            [STATUS.DISABLE]: 'default',
            [STATUS.ENABLE]: 'processing',
          }[status] as BadgeProps['status'];
          return (
            <List.Item className={`${styles.item} ${badgeStatus}`}>
              <Card
                hoverable
                actions={[
                  <ToggleStatus
                    key="1"
                    value={status}
                    onChange={handleSwitchStatusChange(item)}
                  />,
                  <Icon key="2" type="edit" onClick={pushToDetail(id)} />,
                  <PopconfirmDelete key="3" onDelete={hanldeDeleteItem(item)}>
                    <Icon type="delete" style={{ color: '#f5222d' }} />
                  </PopconfirmDelete>,
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
