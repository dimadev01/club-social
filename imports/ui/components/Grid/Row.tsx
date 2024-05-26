import React from 'react';
import { Row as AntRow, RowProps } from 'antd';

type Props = RowProps;

export const Row: React.FC<Props> = ({ children, ...rest }) => (
  <AntRow gutter={[16, 16]} {...rest}>
    {children}
  </AntRow>
);
