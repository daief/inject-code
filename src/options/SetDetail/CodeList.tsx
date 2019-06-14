import { renderOptions } from '@/common/comptsHelper';
import { removeIndex } from '@/common/utils';
import { ToggleStatusButton } from '@/components/ToggleStatus';
import { FileSetDetail, SourceFile, STATUS } from '@/interfaces/entities';
import { Button, Col, Form, Input, List, Row, Select } from 'antd';
import * as React from 'react';
import { useMappedState } from 'redux-react-hook';
import { mapState } from '.';
import { useStore } from '../store';
import { RUN_AT_OPTIONS, SOURCE_TYPE_OPTIONS } from '../store/options';

export const CodeList: React.SFC<{}> = props => {
  const { dispatch } = useStore();
  const { detail } = useMappedState(mapState());
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
  return (
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
  );
};
