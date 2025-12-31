import { TeamOutlined } from '@ant-design/icons';
import React from 'react';

export const UsersIcon = React.forwardRef<
  HTMLSpanElement,
  React.ComponentProps<typeof TeamOutlined>
>((props, ref) => <TeamOutlined ref={ref} {...props} />);
