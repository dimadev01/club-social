import { BookOutlined } from '@ant-design/icons';
import React from 'react';

export const LedgerIcon = React.forwardRef<
  HTMLSpanElement,
  React.ComponentProps<typeof BookOutlined>
>((props, ref) => <BookOutlined ref={ref} {...props} />);
