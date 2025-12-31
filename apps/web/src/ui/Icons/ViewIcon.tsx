import { EyeOutlined } from '@ant-design/icons';
import React from 'react';

export const ViewIcon = React.forwardRef<
  HTMLSpanElement,
  React.ComponentProps<typeof EyeOutlined>
>((props, ref) => <EyeOutlined ref={ref} {...props} />);
