import { useMobile } from '@/common/hooks';
import { getGlobalOptions, setGlobalOptions } from '@/common/utils';
import { ToggleStatus } from '@/components/ToggleStatus';
import { EXTENSION_GLOBAL_OPTIONS_KEY } from '@/interfaces/entities';
import { Col, Divider, Form, Row } from 'antd';
import * as React from 'react';
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
  const [opts, _setOpts] = React.useState(getGlobalOptions());
  const { status } = opts;
  const setOpts = p => _setOpts(pre => ({ ...pre, ...p }));

  React.useEffect(() => {
    setGlobalOptions(opts);
  }, [opts]);

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
                    setOpts({
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
