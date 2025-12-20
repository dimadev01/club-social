import { StopOutlined } from '@ant-design/icons';
import React from 'react';

export const VoidIcon = React.forwardRef<
  HTMLSpanElement,
  React.ComponentProps<typeof StopOutlined>
>((props, ref) => <StopOutlined ref={ref} {...props} />);
