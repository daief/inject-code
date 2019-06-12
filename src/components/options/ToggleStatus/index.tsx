import { STATUS } from '@/interfaces/entities';
import { Icon, Switch } from 'antd';
import { SwitchProps } from 'antd/lib/switch';
import * as React from 'react';

export const ToggleStatus: React.SFC<
  {
    showChildren?: boolean;
    value: STATUS;
    onChange(v: STATUS): void;
  } & SwitchProps
> = props => {
  const { value, onChange, showChildren = true, ...rest } = props;
  const checkedChildren = showChildren
    ? {
        checkedChildren: <Icon type="check" />,
        unCheckedChildren: <Icon type="close" />,
      }
    : {};
  return (
    <Switch
      {...checkedChildren}
      {...rest}
      checked={value === STATUS.ENABLE}
      onChange={c => onChange(c ? STATUS.ENABLE : STATUS.DISABLE)}
    />
  );
};
