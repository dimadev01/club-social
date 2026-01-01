import { LeftOutlined } from '@ant-design/icons';
import React from 'react';

export const BackIcon = React.forwardRef<
  HTMLSpanElement,
  React.ComponentProps<typeof LeftOutlined>
>((props, ref) => <LeftOutlined ref={ref} {...props} />);
