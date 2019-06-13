import { ToggleStatusButton } from '@/components/options/ToggleStatus';
import { FileSetWithRule } from '@/interfaces/entities';
import { AnyFunc } from '@/interfaces/utils';
import { useStore } from '@/options/store';
import { Button, Card, Col, Icon, List, Row, Tag } from 'antd';
import * as React from 'react';
import { useMappedState } from 'redux-react-hook';
import * as styles from './style.module.less';

const mapState = () =>
  React.useCallback<
    AnyFunc<{
      matchedList: FileSetWithRule[];
      listLoading: boolean;
      addLoading: boolean;
    }>
  >(
    _ => ({
      matchedList: _.popup.matchedList,
      listLoading: _.loading.effects.popup.getMatchedSetList,
      addLoading: _.loading.effects.popup.addNewSetAndRule,
    }),
    [],
  );

export const MatchedSetList: React.SFC<{}> = props => {
  const { dispatch } = useStore();
  const { matchedList, listLoading, addLoading } = useMappedState(mapState());

  React.useEffect(() => {
    dispatch.popup.getMatchedSetList();
  }, []);

  const handleClickAddNewSet = () => {
    dispatch.popup.addNewSetAndRule();
  };

  const handleToggleSetStatus = (item, index) => async value => {
    const count = await dispatch.popup.toggleSetStatus({
      ...item,
      status: value,
    });
    if (count) {
      dispatch.popup.getMatchedSetList();
    }
  };

  const handleClickEdit = item => () => {
    chrome.tabs.create({ url: `options.html#/set-detail?id=${item.id}` }, _ => {
      /* */
    });
  };

  return (
    <div className={styles['matched-list-wrap']}>
      <List
        loading={listLoading}
        grid={{ column: 1 }}
        dataSource={['add', ...matchedList]}
        renderItem={(item, index) => {
          if (typeof item === 'string') {
            return (
              <Row>
                <Col span={24}>
                  <Button
                    type="dashed"
                    icon="plus"
                    style={{ width: '100%', marginBottom: 16 }}
                    loading={addLoading}
                    onClick={handleClickAddNewSet}
                  />
                </Col>
              </Row>
            );
          }

          const { status, name, ruleIds, sourceFileIds } = item;
          return (
            <List.Item>
              <Card
                size="small"
                title={name}
                extra={[
                  <Button
                    key="1"
                    icon="edit"
                    size="small"
                    type="ghost"
                    style={{ marginRight: 5 }}
                    onClick={handleClickEdit(item)}
                  />,
                  <ToggleStatusButton
                    size="small"
                    key="2"
                    value={status}
                    onChange={handleToggleSetStatus(item, index)}
                  />,
                ]}
              >
                <Tag color="blue">
                  <Icon type="link" />
                  &nbsp;
                  {ruleIds.length}
                </Tag>
                <Tag color="cyan">
                  <Icon type="code" />
                  &nbsp;
                  {sourceFileIds.length}
                </Tag>
              </Card>
            </List.Item>
          );
        }}
      />
    </div>
  );
};
