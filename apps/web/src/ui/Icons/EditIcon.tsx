import { EditOutlined } from '@ant-design/icons';
import React from 'react';

export const EditIcon = React.forwardRef<
  HTMLSpanElement,
  React.ComponentProps<typeof EditOutlined>
>((props, ref) => <EditOutlined ref={ref} {...props} />);
