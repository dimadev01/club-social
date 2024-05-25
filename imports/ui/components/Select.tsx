import React from 'react';
import { Select as AntSelect, SelectProps } from 'antd';

type Props = SelectProps;

export const Select: React.FC<Props> = React.forwardRef(
  (
    { children, placeholder = 'Seleccionar', allowClear = true, ...props },
    ref,
  ) => (
    <AntSelect
      // @ts-expect-error
      ref={ref}
      optionFilterProp="label"
      placeholder={placeholder}
      allowClear={allowClear}
      {...props}
    >
      {children}
    </AntSelect>
  ),
);
