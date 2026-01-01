import { SaveOutlined } from '@ant-design/icons';
import React from 'react';

export const SaveIcon = React.forwardRef<
  HTMLSpanElement,
  React.ComponentProps<typeof SaveOutlined>
>((props, ref) => <SaveOutlined ref={ref} {...props} />);
