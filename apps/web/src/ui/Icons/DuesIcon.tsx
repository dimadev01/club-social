import { WalletOutlined } from '@ant-design/icons';
import React from 'react';

export const DuesIcon = React.forwardRef<
  HTMLSpanElement,
  React.ComponentProps<typeof WalletOutlined>
>((props, ref) => <WalletOutlined ref={ref} {...props} />);
