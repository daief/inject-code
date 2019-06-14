import { renderOptions } from '@/common/comptsHelper';
import { getHashQuery, removeIndex } from '@/common/utils';
import { ToggleStatusButton } from '@/components/ToggleStatus';
import { FileSetDetail, Rule, STATUS } from '@/interfaces/entities';
import { AnyFunc } from '@/interfaces/utils';
import { Button, Col, Empty, Form, Input, List, Row, Select, Spin } from 'antd';
import * as React from 'react';
import { useMappedState } from 'redux-react-hook';
import { useStore } from '../store';
import { MATCH_TYPE_OPTIONS } from '../store/options';
import { CodeList } from './CodeList';
import { TopActions } from './TopActions';

const { useEffect, useCallback } = React;

export const mapState = () =>
  useCallback<
    AnyFunc<{
      saveLoading: boolean;
      detail: FileSetDetail | undefined;
      detailCopy: FileSetDetail | undefined;
    }>
  >(
    _ => ({
      saveLoading: _.loading.effects.options.saveFileSet,
      detail: _.options.detail,
      detailCopy: _.options.detailCopy,
    }),
    [],
  );

export const SetDetail: React.SFC = props => {
  const { dispatch } = useStore();
  const { saveLoading, detail, detailCopy } = useMappedState(mapState());
  const setDetail = (_: Partial<FileSetDetail> = {}) =>
    dispatch.options.setState({
      detail: {
        ...detail,
        ..._,
      },
    });
  const fileSetId = +getHashQuery('id');

  const { name, ruleList } =
    detail ||
    // tslint:disable-next-line: no-object-literal-type-assertion
    ({
      name: '',
      ruleList: [],
      sourceFileList: [],
      id: 0,
      status: STATUS.ENABLE,
    } as FileSetDetail);

  useEffect(() => {
    const windowBeforeunloadHandler = e => {
      if (JSON.stringify(detail) !== JSON.stringify(detailCopy)) {
        e.returnValue = true;
      }
    };
    window.addEventListener('beforeunload', windowBeforeunloadHandler);

    return () => {
      window.removeEventListener('beforeunload', windowBeforeunloadHandler);
    };
  }, [detail, detailCopy]);

  useEffect(() => {
    dispatch.options.getFileSetDetail({ id: fileSetId });
  }, [fileSetId]);

  // ------------------------------------------------------------ event handlers

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDetail({ name: e.target.value });
  };

  const handleRuleMatchTypeChange = ruleId => value => {
    const index = ruleList.findIndex(_ => _.id === ruleId);
    if (index > -1) {
      ruleList[index].matchType = value;
      setDetail({
        ruleList: [...ruleList],
      });
    }
  };

  const handleRuleToggleStatusClick = ruleId => value => {
    const index = ruleList.findIndex(_ => _.id === ruleId);
    if (index > -1) {
      ruleList[index].status = value;
      setDetail({
        ruleList: [...ruleList],
      });
    }
  };

  const handleRuleContentChange = ruleId => e => {
    const index = ruleList.findIndex(_ => _.id === ruleId);
    if (index > -1) {
      ruleList[index].regexContent = e.target.value;
      setDetail({
        ruleList: [...ruleList],
      });
    }
  };

  const handleClickDeleteRule = ruleId => () => {
    const index = ruleList.findIndex(_ => _.id === ruleId);
    if (index > -1) {
      setDetail({ ruleList: removeIndex(ruleList, index) });
    }
  };

  return detail ? (
    <Spin spinning={saveLoading}>
      <Row gutter={16}>
        <Col md={12} sm={24}>
          <Form.Item label="Name" validateStatus={name ? '' : 'error'}>
            <Input value={name} onChange={handleNameChange} />
          </Form.Item>
        </Col>
        <Col md={12} sm={24}>
          <TopActions />
        </Col>
      </Row>
      <List
        dataSource={ruleList}
        rowKey="id"
        grid={{ gutter: 8, md: 2, sm: 1 }}
        bordered
        header="Rule list"
        size="small"
        renderItem={(rule: Rule) => {
          const {
            id: ruleId,
            regexContent,
            matchType,
            status: ruleStatus,
          } = rule;
          return (
            <List.Item style={{ marginTop: 8 }}>
              <Row gutter={8}>
                <Col md={14} sm={24}>
                  <Input
                    value={regexContent}
                    onChange={handleRuleContentChange(ruleId)}
                    placeholder="Write your regex here"
                    size="small"
                    disabled={ruleStatus === STATUS.DISABLE}
                  />
                </Col>
                <Col md={6} sm={16} xs={16}>
                  <Select
                    size="small"
                    value={matchType}
                    onChange={handleRuleMatchTypeChange(ruleId)}
                    style={{ width: '100%' }}
                  >
                    {renderOptions(MATCH_TYPE_OPTIONS())}
                  </Select>
                </Col>
                <Col md={4} sm={8} xs={8}>
                  <ToggleStatusButton
                    size="small"
                    value={ruleStatus}
                    onChange={handleRuleToggleStatusClick(ruleId)}
                  />
                  <Button
                    type="danger"
                    onClick={handleClickDeleteRule(ruleId)}
                    size="small"
                    icon="delete"
                  />
                </Col>
              </Row>
            </List.Item>
          );
        }}
      />
      <CodeList />
    </Spin>
  ) : (
    <Empty />
  );
};
