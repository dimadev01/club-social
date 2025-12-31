import { CreditCardOutlined } from '@ant-design/icons';
import React from 'react';

export const PaymentsIcon = React.forwardRef<
  HTMLSpanElement,
  React.ComponentProps<typeof CreditCardOutlined>
>((props, ref) => <CreditCardOutlined ref={ref} {...props} />);
