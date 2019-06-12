import { NEW_THING_ID_PREFIX_MARK } from '@/common/utils';
import { hashHistory } from '@/components/hashHistory';
import { ToggleStatus } from '@/components/options/ToggleStatus';
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
import { ButtonProps } from 'antd/lib/button';
import * as React from 'react';
import { useMappedState } from 'redux-react-hook';
import { useStore } from '../store';
import * as styles from './style.module.less';

const { useCallback, useState, useEffect } = React;

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

  const { id, status, name } = detail;
  const affixedClass: string = affixed ? styles.affixed : '';

  useEffect(() => {
    const keydownHandler = (e: KeyboardEvent) => {
      if (e.keyCode === 83 && (e.ctrlKey || e.metaKey) && name) {
        e.preventDefault();
        handleSave();
      }
    };
    window.addEventListener('keydown', keydownHandler);
    return () => {
      window.removeEventListener('keydown', keydownHandler);
    };
  }, [name]);

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

  const handleStatusChange = value => {
    setDetail({ status: value });
  };

  const handleDeleteSet = () => {
    dispatch.all.deleteFileSet({ id }).then(() => {
      hashHistory.replace('/');
    });
  };

  const btnsCfg: ButtonProps[] = [
    {
      icon: 'link',
      children: affixed ? '' : 'Add rule',
      onClick: handleAddNewRuleOfSet,
      // TODO title
      title: 'Add rule',
    },
    {
      icon: 'code',
      children: affixed ? '' : 'Add file',
      onClick: handleAddNewFileOfSet,
    },
    {
      icon: 'save',
      children: affixed ? '' : 'Save',
      onClick: handleSave,
      disabled: !name,
      type: 'primary',
    },
    {
      icon: 'delete',
      children: affixed ? '' : 'Delete',
      onClick: handleDeleteSet,
      type: 'danger',
    },
  ];

  return (
    <Affix offsetTop={20} onChange={setAffixed} className={affixedClass}>
      <Form.Item label="Actions">
        <ToggleStatus
          value={status}
          onChange={handleStatusChange}
          style={{ marginRight: 10 }}
        />

        <Button.Group>
          {btnsCfg.map((c, i) => (
            <Button key={i} {...c} />
          ))}
        </Button.Group>

        {props.children}
      </Form.Item>
    </Affix>
  );
};
