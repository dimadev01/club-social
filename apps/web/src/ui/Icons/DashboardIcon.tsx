import { HomeOutlined } from '@ant-design/icons';
import React from 'react';

export const DashboardIcon = React.forwardRef<
  HTMLSpanElement,
  React.ComponentProps<typeof HomeOutlined>
>((props, ref) => <HomeOutlined ref={ref} {...props} />);
