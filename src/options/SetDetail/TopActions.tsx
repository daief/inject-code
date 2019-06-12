import { NEW_THING_ID_PREFIX_MARK } from '@/common/utils';
import {
  FileSetDetail,
  MATCH_TYPE,
  Rule,
  RUN_AT,
  SOURCE_TYPE,
  SourceFile,
  STATUS,
} from '@/interfaces/entities';
import { AnyFunc } from '@/interfaces/utils';
import { Affix, Button, Form } from 'antd';
import * as React from 'react';
import { useMappedState } from 'redux-react-hook';
import { useStore } from '../store';
import * as styles from './style.module.less';

const { useCallback, useState } = React;

const mapState = () =>
  useCallback<
    AnyFunc<{
      saveLoading: boolean;
      detail: FileSetDetail | undefined;
    }>
  >(
    _ => ({
      saveLoading: _.loading.effects.options.saveFileSet,
      detail: _.options.detail,
    }),
    [],
  );

export const TopActions: React.SFC<{}> = props => {
  const { detail } = useMappedState(mapState());
  const { dispatch } = useStore();
  const [affixed, setAffixed] = useState(false);
  const setDetail = (_: Partial<FileSetDetail> = {}) =>
    dispatch.options.setState({
      detail: {
        ...detail,
        ..._,
      },
    });

  const { id } = detail;
  const affixedClass: string = affixed ? styles.affixed : '';

  const handleAddNewRuleOfSet = async () => {
    const rule: Rule = {
      id: `${NEW_THING_ID_PREFIX_MARK}${Date.now()}`,
      filesSetId: id,
      regexContent: '',
      status: STATUS.ENABLE,
      matchType: MATCH_TYPE.DOMAIN,
    };
    detail.ruleList.push(rule);
    setDetail();
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
    setDetail();
  };

  const handleSave = async () => {
    dispatch.options.saveFileSet(detail);
  };

  return (
    <Affix offsetTop={20} onChange={setAffixed} className={affixedClass}>
      <Form.Item label="Actions">
        <Button.Group>
          <Button onClick={handleAddNewRuleOfSet}>Add rule</Button>
          <Button onClick={handleAddNewFileOfSet}>Add file</Button>
          <Button
            type="primary"
            onClick={handleSave}
            disabled={!detail.name}
            icon="save"
          >
            Save
          </Button>
        </Button.Group>
        {props.children}
      </Form.Item>
    </Affix>
  );
};
