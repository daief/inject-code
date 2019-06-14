import { useMobile } from '@/common/hooks';
import { ToggleStatus } from '@/components/ToggleStatus';
import {
  EXTENSION_GLOBAL_OPTIONS_KEY,
  ExtensionGlobalOptions,
} from '@/interfaces/entities';
import { AnyFunc } from '@/interfaces/utils';
import { Col, Divider, Form, Row } from 'antd';
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
    {line && <Divider />}
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
  const { status } = globalOptions;
  const { dispatch } = useStore();

  React.useEffect(() => {
    dispatch.all.getGlobalOptions();
  }, []);

  return (
    <Form
      className={`${styles.wrap} ${isMobile && styles['wrap-m']}`}
      layout={isMobile ? 'vertical' : 'inline'}
    >
      <Panel
        title="normal"
        line={false}
        content={
          <>
            <div>
              <Form.Item label="Extension Status">
                <ToggleStatus
                  value={status}
                  onChange={_ =>
                    dispatch.all.updateGlobalOptions({
                      [EXTENSION_GLOBAL_OPTIONS_KEY.status]: _,
                    })
                  }
                />
              </Form.Item>
            </div>
          </>
        }
      />
    </Form>
  );
};
