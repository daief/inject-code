import { renderOptions } from '@/common/comptsHelper';
import { getHashQuery, removeIndex } from '@/common/utils';
import { ToggleStatusButton } from '@/components/ToggleStatus';
import { FileSetDetail, Rule, STATUS } from '@/interfaces/entities';
import { AnyFunc } from '@/interfaces/utils';
import {
  Button,
  Col,
  Dropdown,
  Empty,
  Form,
  Icon,
  Input,
  List,
  Menu,
  Row,
  Select,
  Spin,
} from 'antd';
import * as React from 'react';
import { useMappedState } from 'redux-react-hook';
import { useStore } from '../store';
import {
  MATCH_TYPE_OPTIONS,
  RUN_AT_OPTIONS,
  SOURCE_TYPE_OPTIONS,
} from '../store/options';
import { TopActions } from './TopActions';

const { useEffect, useState, useCallback } = React;

const mapState = () =>
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

  const { name, ruleList, sourceFileList, id, status } =
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

  const handleSourceTypeChange = fileId => value => {
    const index = sourceFileList.findIndex(_ => _.id === fileId);
    if (index > -1) {
      sourceFileList[index].sourceType = value;
      setDetail({
        sourceFileList: [...sourceFileList],
      });
    }
  };

  const handleRunAtTypeChange = fileId => value => {
    const index = sourceFileList.findIndex(_ => _.id === fileId);
    if (index > -1) {
      sourceFileList[index].runAt = value;
      setDetail({
        sourceFileList: [...sourceFileList],
      });
    }
  };

  const handleFileToggleStatusClick = fileId => value => {
    const index = sourceFileList.findIndex(_ => _.id === fileId);
    if (index > -1) {
      sourceFileList[index].status = value;
      setDetail({
        sourceFileList: [...sourceFileList],
      });
    }
  };

  const handleFileContentChange = fileId => e => {
    const index = sourceFileList.findIndex(_ => _.id === fileId);
    if (index > -1) {
      sourceFileList[index].content = e.target.value;
      setDetail({
        sourceFileList: [...sourceFileList],
      });
    }
  };

  const handleClickDeleteFile = fileId => () => {
    const index = sourceFileList.findIndex(_ => _.id === fileId);
    if (index > -1) {
      setDetail({ sourceFileList: removeIndex(sourceFileList, index) });
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
                <Col md={8} sm={18}>
                  <Select
                    size="small"
                    value={matchType}
                    onChange={handleRuleMatchTypeChange(ruleId)}
                    style={{ width: '100%' }}
                  >
                    {renderOptions(MATCH_TYPE_OPTIONS())}
                  </Select>
                </Col>
                <Col md={2} sm={6}>
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
      <List
        style={{ marginTop: 16 }}
        dataSource={sourceFileList}
        grid={{ gutter: 8 }}
        rowKey="id"
        bordered
        header="Source file list"
        split
        renderItem={item => {
          const {
            id: fileId,
            sourceType,
            content,
            runAt,
            status: fileStatus,
          } = item;
          const style100 = {
            width: '100%',
          };
          return (
            <List.Item>
              <Row gutter={16}>
                <Col md={4} sm={24}>
                  <Form.Item label="Source type">
                    <Select
                      value={sourceType}
                      style={style100}
                      onChange={handleSourceTypeChange(fileId)}
                    >
                      {renderOptions(SOURCE_TYPE_OPTIONS())}
                    </Select>
                  </Form.Item>
                </Col>
                <Col md={4} sm={24}>
                  <Form.Item label="Run at">
                    <Select
                      value={runAt}
                      style={style100}
                      onChange={handleRunAtTypeChange(fileId)}
                    >
                      {renderOptions(RUN_AT_OPTIONS())}
                    </Select>
                  </Form.Item>
                </Col>
                <Col md={16} sm={24}>
                  <Form.Item label="Actions">
                    <Button.Group>
                      <ToggleStatusButton
                        value={fileStatus}
                        onChange={handleFileToggleStatusClick(fileId)}
                      />
                      <Button
                        type="danger"
                        onClick={handleClickDeleteFile(fileId)}
                        icon="delete"
                      />
                    </Button.Group>
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <Input.TextArea
                    value={content}
                    placeholder="Write code here"
                    autosize={{
                      minRows: 5,
                      maxRows: 10,
                    }}
                    spellCheck={false}
                    disabled={fileStatus === STATUS.DISABLE}
                    onChange={handleFileContentChange(fileId)}
                    style={{ fontSize: 14, lineHeight: 1.35 }}
                  />
                </Col>
              </Row>
            </List.Item>
          );
        }}
      />
    </Spin>
  ) : (
    <Empty />
  );
};
