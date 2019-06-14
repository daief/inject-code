import { useMobile } from '@/common/hooks';
import {
  boolean2status,
  status2boolean,
  ToggleStatus,
} from '@/components/ToggleStatus';
import {
  EXTENSION_GLOBAL_OPTIONS_KEY,
  ExtensionGlobalOptions,
} from '@/interfaces/entities';
import { AnyFunc } from '@/interfaces/utils';
import { Col, Divider, Form, Row, Select } from 'antd';
import { FormItemProps } from 'antd/lib/form';
import * as React from 'react';
import { useMappedState } from 'redux-react-hook';
import { useStore } from '../store';
import * as styles from './style.module.less';

const Panel: React.SFC<{
  title?: React.ReactNode;
  content?: React.ReactNode;
  line?: boolean;
}> = ({ title, content, line = true }) => (
  <>
    <Row gutter={8}>
      <Col md={4} sm={24} className={styles.title}>
        {title}
      </Col>
      <Col md={20} sm={24}>
        {content}
      </Col>
    </Row>
    {line && (
      <Divider
        style={{
          width: '90%',
          minWidth: '90%',
          marginLeft: 'auto',
          marginRight: 'auto',
        }}
      />
    )}
  </>
);

export const Setting: React.SFC<{}> = props => {
  const isMobile = useMobile();
  const { globalOptions } = useMappedState(
    React.useCallback<
      AnyFunc<{
        globalOptions: ExtensionGlobalOptions;
      }>
    >(
      _ => ({
        globalOptions: _.all.globalOptions,
      }),
      [],
    ),
  );
  const {
    [EXTENSION_GLOBAL_OPTIONS_KEY.status]: status,
    [EXTENSION_GLOBAL_OPTIONS_KEY.useCodeEditor]: useCodeEditor,
    [EXTENSION_GLOBAL_OPTIONS_KEY.codemirrorTheme]: codemirrorTheme,
    [EXTENSION_GLOBAL_OPTIONS_KEY.codemirrorLineNumbers]: codemirrorLineNumbers,
  } = globalOptions;
  const { dispatch } = useStore();

  React.useEffect(() => {
    dispatch.all.getGlobalOptions();
  }, []);

  const colLayout1_2 = {
    md: 12,
    sm: 24,
    xs: 24,
  };

  const formItemLayout: FormItemProps = {
    labelCol: {
      md: 8,
    },
    labelAlign: 'left',
  };

  return (
    <Form
      className={`${styles.wrap} ${isMobile && styles['wrap-m']}`}
      layout={isMobile ? 'vertical' : 'inline'}
    >
      <Panel
        title="Normal"
        content={
          <>
            <Row gutter={16}>
              <Col {...colLayout1_2}>
                <Form.Item {...formItemLayout} label="Extension Status">
                  <ToggleStatus
                    value={status}
                    onChange={_ =>
                      dispatch.all.updateGlobalOptions({
                        [EXTENSION_GLOBAL_OPTIONS_KEY.status]: _,
                      })
                    }
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col {...colLayout1_2}>
                <Form.Item
                  {...formItemLayout}
                  label="Enable code editor"
                  help={
                    <>
                      Use code editor to display code. <br />
                      Considering performance, it is turned off by default.
                    </>
                  }
                >
                  <ToggleStatus
                    value={boolean2status(useCodeEditor)}
                    onChange={_ =>
                      dispatch.all.updateGlobalOptions({
                        [EXTENSION_GLOBAL_OPTIONS_KEY.useCodeEditor]: status2boolean(
                          _,
                        ),
                      })
                    }
                  />
                </Form.Item>
              </Col>
            </Row>
          </>
        }
      />
      <Panel
        title="Code Editor"
        line={false}
        content={
          <>
            <Row gutter={16}>
              <Col {...colLayout1_2}>
                <Form.Item {...formItemLayout} label="Theme">
                  <Select
                    className={styles['editor-theme-select']}
                    value={codemirrorTheme}
                    onChange={_ =>
                      dispatch.all.updateGlobalOptions({
                        [EXTENSION_GLOBAL_OPTIONS_KEY.codemirrorTheme]: _,
                      })
                    }
                    disabled={!useCodeEditor}
                  >
                    {[
                      ['material', '#263238'],
                      ['base16-light', '#f5f5f5'],
                      ['twilight', '#141414'],
                    ].map(([t, color]) => (
                      <Select.Option key={t} value={t}>
                        <span
                          className={styles['color-panel']}
                          style={{
                            backgroundColor: color,
                          }}
                        />
                        {t}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col {...colLayout1_2}>
                <Form.Item {...formItemLayout} label="Line numbers">
                  <ToggleStatus
                    disabled={!useCodeEditor}
                    value={boolean2status(codemirrorLineNumbers)}
                    onChange={_ =>
                      dispatch.all.updateGlobalOptions({
                        [EXTENSION_GLOBAL_OPTIONS_KEY.codemirrorLineNumbers]: status2boolean(
                          _,
                        ),
                      })
                    }
                  />
                </Form.Item>
              </Col>
            </Row>
          </>
        }
      />
    </Form>
  );
};
