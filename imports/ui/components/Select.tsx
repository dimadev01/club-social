import React from 'react';
import { Select as AntSelect, SelectProps } from 'antd';

type Props = SelectProps;

export const Select: React.FC<Props> = ({
  children,
  placeholder = 'Seleccionar',
  allowClear = true,
  ...props
}) => (
  <AntSelect placeholder={placeholder} allowClear={allowClear} {...props}>
    {children}
  </AntSelect>
);
