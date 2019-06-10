import { useForceUpdate } from '@/common/hooks';
import { NEW_THING_ID_PREFIX_MARK, removeIndex } from '@/common/utils';
import { FileSetDetail, MATCH_TYPE, Rule, STATUS } from '@/interfaces/entities';
import {
  Button,
  Col,
  Empty,
  Form,
  Icon,
  Input,
  List,
  Row,
  Select,
  Spin,
} from 'antd';
import * as React from 'react';
import { useStore } from '../store';
import { MATCH_TYPE_OPTIONS } from '../store/options';

const { useEffect, useState, useCallback } = React;

export const SetDetail: React.SFC<{}> = props => {
  const { dispatch } = useStore();
  const [detail, _setDetail] = useState<FileSetDetail>(undefined);
  const setDetail = (obj: { [k: string]: any }) =>
    _setDetail(pre => ({ ...pre, ...obj }));
  const { name, ruleList, sourceFileList, id, status } = detail || {
    name: '',
    ruleList: [],
    sourceFileList: [],
    id: 0,
    status: '',
  };
  const forceRender = useForceUpdate();

  useEffect(() => {
    // window.addEventListener('beforeunload', e => {
    //   e.returnValue = true
    // });
    // TODO id
    dispatch.options.getFileSetDetail({ id: 3 }).then(d => setDetail(d));
  }, []);

  // ------------------------------------------------------------ event handlers

  const handleAddNewRuleOfSet = async () => {
    const rule: Rule = {
      id: `${NEW_THING_ID_PREFIX_MARK}${Date.now()}`,
      filesSetId: id,
      regexContent: '',
      status: STATUS.ENABLE,
      matchType: MATCH_TYPE.DOMAIN,
    };
    detail.ruleList.push(rule);
    forceRender();
  };

  const handleSave = async () => {
    dispatch.options.saveFileSet(detail).then(d => setDetail(d));
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDetail({ name: e.target.value });
  };

  const handleRuleMatchTypeChange = ruleId => value => {
    const index = ruleList.findIndex(_ => _.id === ruleId);
    if (index > -1) {
      ruleList[index].matchType = value;
      forceRender();
    }
  };

  const handleRuleContentChange = ruleId => e => {
    const index = ruleList.findIndex(_ => _.id === ruleId);
    if (index > -1) {
      ruleList[index].regexContent = e.target.value;
      forceRender();
    }
  };

  const handleClickDeleteRule = ruleId => () => {
    const index = ruleList.findIndex(_ => _.id === ruleId);
    if (index > -1) {
      setDetail({ ruleList: removeIndex(ruleList, index) });
    }
  };

  return detail ? (
    <Spin spinning={false}>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item label="Name">
            <Input value={name} onChange={handleNameChange} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Actions">
            <Button onClick={handleAddNewRuleOfSet}>Add new rule</Button>
            <Button type="primary" onClick={handleSave}>
              Save
            </Button>
          </Form.Item>
        </Col>
      </Row>
      <List
        dataSource={ruleList}
        rowKey="id"
        grid={{ gutter: 8, column: 2 }}
        bordered
        header="Rule list"
        renderItem={(rule: Rule) => {
          const { id: ruleId, regexContent, matchType } = rule;
          return (
            <List.Item style={{ display: 'flex', marginTop: 8 }}>
              <Select
                value={matchType}
                onChange={handleRuleMatchTypeChange(ruleId)}
                style={{ width: 140 }}
              >
                {MATCH_TYPE_OPTIONS().map(([value, label]) => (
                  <Select.Option key={value} value={value}>
                    {label}
                  </Select.Option>
                ))}
              </Select>
              <Input
                value={regexContent}
                onChange={handleRuleContentChange(ruleId)}
                placeholder="Write your regex here"
                style={{
                  width: 0,
                  flex: 1,
                }}
              />
              <Button type="dashed" onClick={handleClickDeleteRule(ruleId)}>
                <Icon type="delete" />
              </Button>
            </List.Item>
          );
        }}
      />
    </Spin>
  ) : (
    <Empty />
  );
};
