import { Popconfirm } from 'antd';
import * as React from 'react';

export const PopconfirmDelete: React.SFC<{
  onDelete(): void;
}> = props => {
  return (
    <Popconfirm
      key="3"
      title={'Are you sure to delete?'}
      okText={'Delete'}
      okType="danger"
      cancelText={'No'}
      onConfirm={props.onDelete}
    >
      {props.children}
    </Popconfirm>
  );
};
