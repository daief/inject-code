import { Select } from 'antd';
import * as React from 'react';

export function renderOptions(options: string[][] | Array<[string, string]>) {
  // @ts-ignore
  return options.map(([value, label]) => (
    <Select.Option key={value} value={value}>
      {label}
    </Select.Option>
  ));
}
