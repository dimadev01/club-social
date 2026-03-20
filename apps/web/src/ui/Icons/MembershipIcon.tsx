import { IdcardOutlined } from '@ant-design/icons';
import React from 'react';

export const MembershipIcon = React.forwardRef<
  HTMLSpanElement,
  React.ComponentProps<typeof IdcardOutlined>
>((props, ref) => <IdcardOutlined ref={ref} {...props} />);
