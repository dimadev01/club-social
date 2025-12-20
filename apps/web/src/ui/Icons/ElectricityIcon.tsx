import { PlusOutlined } from '@ant-design/icons';
import React from 'react';

export const ElectricityIcon = React.forwardRef<
  HTMLSpanElement,
  React.ComponentProps<typeof PlusOutlined>
>((props, ref) => <PlusOutlined ref={ref} {...props} />);
