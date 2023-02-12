import React from 'react';
import { Typography } from 'antd';
import type { TitleProps } from 'antd/es/typography/Title';

type Props = TitleProps;

export const PageHeader: React.FC<Props> = ({ children, ...props }) => (
  <Typography.Title
    className="!text-3xl text-center sm:text-left !mb-10 !text-black !font-normal"
    {...props}
  >
    {children}
  </Typography.Title>
);
