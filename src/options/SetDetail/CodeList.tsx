import { renderOptions } from '@/common/comptsHelper';
import { NEW_THING_ID_PREFIX_MARK, removeIndex } from '@/common/utils';
import { ToggleStatusButton } from '@/components/ToggleStatus';
import {
  EXTENSION_GLOBAL_OPTIONS_KEY,
  FileSetDetail,
  RUN_AT,
  SOURCE_TYPE,
  SourceFile,
  STATUS,
} from '@/interfaces/entities';
import { Button, Col, Form, List, Row, Select } from 'antd';
import * as React from 'react';
import { useMappedState } from 'redux-react-hook';
import { mapState } from '.';
import { Codemirror2 } from '../components/Codemirror2';
import { useStore } from '../store';
import { RUN_AT_OPTIONS, SOURCE_TYPE_OPTIONS } from '../store/options';
import * as styles from './style.module.less';

export const CodeList: React.SFC<{}> = props => {
  const { dispatch } = useStore();
  const { detail, globalOptions } = useMappedState(mapState());
  const setDetail = (_: Partial<FileSetDetail> = {}) =>
    dispatch.options.setState({
      detail: {
        ...detail,
        ..._,
      },
    });

  const { sourceFileList } =
    detail ||
    // tslint:disable-next-line: no-object-literal-type-assertion
    ({
      sourceFileList: [],
    } as FileSetDetail);

  const {
    [EXTENSION_GLOBAL_OPTIONS_KEY.useCodeEditor]: useCodeEditor,
  } = globalOptions;

  // ---------------------------------------------------------------------------------------------------- events

  const handleAddNewFileOfSet = async () => {
    const f: SourceFile = {
      id: `${NEW_THING_ID_PREFIX_MARK}${Date.now()}`,
      content: '',
      status: STATUS.ENABLE,
      sourceType: SOURCE_TYPE.JS,
      runAt: RUN_AT.DOCUMENT_IDLE,
    };
    detail.sourceFileList.push(f);
    setDetail();
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

  const handleFileContentChange = fileId => (value: string) => {
    const index = sourceFileList.findIndex(_ => _.id === fileId);
    if (index > -1) {
      sourceFileList[index].content = value;
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
  return (
    <List
      style={{ marginTop: 16 }}
      dataSource={
        sourceFileList.length
          ? sourceFileList
          : [
              'add',
              // avoid ts type error
              ...sourceFileList,
            ]
      }
      grid={{ gutter: 8 }}
      rowKey="id"
      bordered
      header="Source code list"
      split
      renderItem={item => {
        if (typeof item === 'string') {
          return (
            <List.Item>
              <Button
                icon="plus"
                type="dashed"
                style={{
                  width: '100%',
                  height: 128,
                  margin: '10px 0',
                }}
                onClick={handleAddNewFileOfSet}
              />
            </List.Item>
          );
        }
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
                {useCodeEditor ? (
                  <Codemirror2
                    options={{
                      sourceType,
                      readOnly:
                        fileStatus === STATUS.DISABLE ? 'nocursor' : false,
                      scrollbarStyle: 'null',
                    }}
                    value={content}
                    onChange={handleFileContentChange(fileId)}
                  />
                ) : (
                  <textarea
                    value={content}
                    onChange={e =>
                      handleFileContentChange(fileId)(e.target.value)
                    }
                    className={styles['code-textarea']}
                    rows={10}
                    disabled={fileStatus === STATUS.DISABLE}
                    spellCheck={false}
                    placeholder="Write code here"
                  />
                )}
              </Col>
            </Row>
          </List.Item>
        );
      }}
    />
  );
};
