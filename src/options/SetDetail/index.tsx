import { renderOptions } from '@/common/comptsHelper';
import { useForceUpdate } from '@/common/hooks';
import {
  getHashQuery,
  NEW_THING_ID_PREFIX_MARK,
  removeIndex,
} from '@/common/utils';
import {
  FileSetDetail,
  MATCH_TYPE,
  Rule,
  RUN_AT,
  SOURCE_TYPE,
  SourceFile,
  STATUS,
} from '@/interfaces/entities';
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
import {
  MATCH_TYPE_OPTIONS,
  RUN_AT_OPTIONS,
  SOURCE_TYPE_OPTIONS,
} from '../store/options';

const { useEffect, useState, useCallback } = React;

export const SetDetail: React.SFC<{}> = props => {
  const { dispatch } = useStore();
  const [detail, _setDetail] = useState<FileSetDetail>(undefined);
  const setDetail = (obj: { [k: string]: any }) =>
    _setDetail(pre => ({ ...pre, ...obj }));
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
  const forceRender = useForceUpdate();

  useEffect(() => {
    // window.addEventListener('beforeunload', e => {
    //   e.returnValue = true
    // });
    dispatch.options
      .getFileSetDetail({ id: +getHashQuery('id') })
      .then(d => setDetail(d));
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

  const handleAddNewFileOfSet = async () => {
    const f: SourceFile = {
      id: `${NEW_THING_ID_PREFIX_MARK}${Date.now()}`,
      content: '',
      status: STATUS.ENABLE,
      sourceType: SOURCE_TYPE.JS,
      runAt: RUN_AT.DOCUMENT_IDLE,
    };
    detail.sourceFileList.push(f);
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

  const handleSourceTypeChange = fileId => value => {
    const index = sourceFileList.findIndex(_ => _.id === fileId);
    if (index > -1) {
      sourceFileList[index].sourceType = value;
      forceRender();
    }
  };

  const handleRunAtTypeChange = fileId => value => {
    const index = sourceFileList.findIndex(_ => _.id === fileId);
    if (index > -1) {
      sourceFileList[index].runAt = value;
      forceRender();
    }
  };

  const handleFileContentChange = fileId => e => {
    const index = sourceFileList.findIndex(_ => _.id === fileId);
    if (index > -1) {
      sourceFileList[index].content = e.target.value;
      forceRender();
    }
  };

  const handleClickDeleteFile = fileId => () => {
    const index = sourceFileList.findIndex(_ => _.id === fileId);
    if (index > -1) {
      setDetail({ sourceFileList: removeIndex(sourceFileList, index) });
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
            <Button.Group>
              <Button onClick={handleAddNewRuleOfSet}>Add new rule</Button>
              <Button onClick={handleAddNewFileOfSet}>Add new file</Button>
              <Button type="primary" onClick={handleSave}>
                Save
              </Button>
            </Button.Group>
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
          // TODO status
          const { id: ruleId, regexContent, matchType } = rule;
          return (
            <List.Item style={{ display: 'flex', marginTop: 8 }}>
              <Select
                value={matchType}
                onChange={handleRuleMatchTypeChange(ruleId)}
                style={{ width: 140 }}
              >
                {renderOptions(MATCH_TYPE_OPTIONS())}
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
              <Button type="danger" onClick={handleClickDeleteRule(ruleId)}>
                <Icon type="delete" />
              </Button>
            </List.Item>
          );
        }}
      />
      <List
        style={{ marginTop: 16 }}
        dataSource={sourceFileList}
        grid={{ gutter: 8, column: 1 }}
        rowKey="id"
        bordered
        header="Source file list"
        renderItem={item => {
          // TODO status
          const { id: fileId, sourceType, content, runAt } = item;
          const style100 = {
            width: '100%',
          };
          return (
            <List.Item>
              <Row gutter={16}>
                <Col span={4}>
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
                <Col span={4}>
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
                <Col span={16}>
                  <Form.Item label="Actions">
                    <Button
                      type="danger"
                      onClick={handleClickDeleteFile(fileId)}
                    >
                      <Icon type="delete" />
                    </Button>
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
                    onChange={handleFileContentChange(fileId)}
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
