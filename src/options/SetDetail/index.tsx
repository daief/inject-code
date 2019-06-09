import { useForceUpdate } from '@/common/hooks';
import { FileSetDetail, MATCH_TYPE, Rule, STATUS } from '@/interfaces/entities';
import { Button, Col, Empty, Form, Icon, Input, List, Row, Select } from 'antd';
import * as React from 'react';
import { useStore } from '../store';
import { MATCH_TYPE_OPTIONS } from '../store/options';

const { useEffect, useState, useCallback } = React;

export const SetDetail: React.SFC<{}> = props => {
  const { dispatch } = useStore();
  const [detail, setDetail] = useState<FileSetDetail>(undefined);
  const { name, ruleList, sourceFileList, id, status } = detail || {
    name: '',
    ruleList: [],
    sourceFileList: [],
    id: 0,
    status: '',
  };
  const [newRuleList, setNewRuleList] = useState<Rule[]>([]);
  const forceUpdate = useForceUpdate();

  useEffect(() => {
    // window.addEventListener('beforeunload', e => {
    //   e.returnValue = true
    // });
    dispatch.options.getFileSetDetail({ id: 3 }).then(d => setDetail(d));
  }, []);

  const handleAddNewRuleOfSet = async () => {
    const rule: Rule = {
      id: Date.now(),
      filesSetId: id,
      regexContent: '',
      status: STATUS.ENABLE,
      matchType: MATCH_TYPE.DOMAIN,
    };
    setNewRuleList(pre => [...pre, rule]);
  };

  const handleClickDeleteRule = ruleId => () => {
    // console.log('click');
    // detail.name = 'ddddddd';
    forceUpdate();
  };

  return detail ? (
    <>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item label="Name">
            <Input value={name} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Actions">
            <Button onClick={handleAddNewRuleOfSet}>Add new rule</Button>
          </Form.Item>
        </Col>
      </Row>
      <List
        dataSource={[...ruleList, ...newRuleList]}
        rowKey="id"
        grid={{ gutter: 8, column: 2 }}
        bordered
        header="Rule list"
        renderItem={(rule: Rule) => {
          const { id: ruleId, regexContent, matchType } = rule;
          return (
            <List.Item style={{ display: 'flex', marginTop: 8 }}>
              <Select defaultValue={matchType} style={{ width: 140 }}>
                {MATCH_TYPE_OPTIONS().map(([value, label]) => (
                  <Select.Option key={value} value={value}>
                    {label}
                  </Select.Option>
                ))}
              </Select>
              <Input value={regexContent} placeholder="Write your regex here" />
              <Button type="dashed" onClick={handleClickDeleteRule(ruleId)}>
                <Icon type="delete" />
              </Button>
            </List.Item>
          );
        }}
      />
    </>
  ) : (
    <Empty />
  );
};
