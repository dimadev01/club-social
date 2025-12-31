import { SwapOutlined } from '@ant-design/icons';
import React from 'react';

export const MovementsIcon = React.forwardRef<
  HTMLSpanElement,
  React.ComponentProps<typeof SwapOutlined>
>((props, ref) => <SwapOutlined ref={ref} {...props} />);
