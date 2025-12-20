import { UserOutlined } from '@ant-design/icons';
import React from 'react';

export const UserIcon = React.forwardRef<
  HTMLSpanElement,
  React.ComponentProps<typeof UserOutlined>
>((props, ref) => <UserOutlined ref={ref} {...props} />);
