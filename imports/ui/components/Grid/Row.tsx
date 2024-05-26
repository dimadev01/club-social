import { Row as AntRow, RowProps } from 'antd';
import React from 'react';

type Props = RowProps;

export const Row: React.FC<Props> = ({ children, ...rest }) => (
  <AntRow gutter={[16, 16]} {...rest}>
    {children}
  </AntRow>
);
