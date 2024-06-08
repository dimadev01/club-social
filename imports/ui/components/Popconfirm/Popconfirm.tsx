import {
  Popconfirm as AntPopconfirm,
  PopconfirmProps as AntPopconfirmProps,
} from 'antd';
import React from 'react';

export type PopconfirmProps = Omit<AntPopconfirmProps, 'title'> & {
  title?: React.ReactNode;
};

export const Popconfirm: React.FC<PopconfirmProps> = ({
  title = '¿Confirma la acción?',
  children,
  ...rest
}) => (
  <AntPopconfirm title={title} {...rest}>
    {children}
  </AntPopconfirm>
);
