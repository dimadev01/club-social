import { LogoutOutlined } from '@ant-design/icons';
import React from 'react';

export const LogoutIcon = React.forwardRef<
  HTMLSpanElement,
  React.ComponentProps<typeof LogoutOutlined>
>((props, ref) => <LogoutOutlined ref={ref} {...props} />);
