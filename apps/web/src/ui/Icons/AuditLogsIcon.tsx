import { AuditOutlined } from '@ant-design/icons';
import React from 'react';

export const AuditLogsIcon = React.forwardRef<
  HTMLSpanElement,
  React.ComponentProps<typeof AuditOutlined>
>((props, ref) => <AuditOutlined ref={ref} {...props} />);
