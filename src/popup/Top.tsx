import { getGlobalOptions, setGlobalOptions } from '@/common/utils';
import { ToggleStatus } from '@/components/ToggleStatus';
import { EXTENSION_GLOBAL_OPTIONS_KEY, STATUS } from '@/interfaces/entities';
import { Alert, PageHeader } from 'antd';
import * as React from 'react';

export const Top: React.SFC<{}> = () => {
  const opts = getGlobalOptions();
  const [status, setStatus] = React.useState<STATUS>();
  React.useEffect(() => {
    setStatus(opts[EXTENSION_GLOBAL_OPTIONS_KEY.status]);
  }, []);

  const handleChangeExtensionStatus = value => {
    setGlobalOptions({ [EXTENSION_GLOBAL_OPTIONS_KEY.status]: value });
    setStatus(value);
  };

  const handleCloseTip = () => {
    setGlobalOptions({
      [EXTENSION_GLOBAL_OPTIONS_KEY.popupTipForRefresh]: false,
    });
  };

  return (
    <PageHeader
      title={
        <a
          onClick={() =>
            chrome.tabs.create({ url: `options.html` }, () => void 0)
          }
        >
          {DEFINE.displayName}
        </a>
      }
      subTitle={DEFINE.version}
      extra={
        <ToggleStatus
          size="small"
          value={status}
          onChange={handleChangeExtensionStatus}
        />
      }
    >
      {opts[EXTENSION_GLOBAL_OPTIONS_KEY.popupTipForRefresh] && (
        <Alert
          message="You need to refresh page to make changes effective"
          closable
          onClose={handleCloseTip}
        />
      )}
    </PageHeader>
  );
};
