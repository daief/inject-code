import { STATUS } from '@/interfaces/entities';
import { Button, Icon, Switch } from 'antd';
import { ButtonProps } from 'antd/lib/button';
import { SwitchProps } from 'antd/lib/switch';
import * as React from 'react';
import * as styles from './style.module.less';

export function status2boolean(status: STATUS): boolean {
  return status === STATUS.ENABLE;
}

export function boolean2status(booleanVal: boolean): STATUS {
  return booleanVal ? STATUS.ENABLE : STATUS.DISABLE;
}

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

export const ToggleStatusButton: React.SFC<
  {
    value: STATUS;
    onChange(v: STATUS): void;
  } & ButtonProps
> = props => {
  const { value, onChange, className, ...rest } = props;
  const isEnable = value === STATUS.ENABLE;

  const handleClick = () => {
    if (onChange) {
      onChange(isEnable ? STATUS.DISABLE : STATUS.ENABLE);
    }
  };

  return (
    <Button
      className={`${className || ''} ${
        isEnable ? '' : styles['toggle-status-disbale']
      }`}
      type={isEnable ? 'primary' : 'default'}
      onClick={handleClick}
      {...rest}
      icon={isEnable ? 'smile' : 'frown'}
    />
  );
};
