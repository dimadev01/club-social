import { PlusOutlined } from '@ant-design/icons';
import React from 'react';

import { UsersIcon } from './UsersIcon';

export const GuestIcon = React.forwardRef<
  HTMLSpanElement,
  React.ComponentProps<typeof PlusOutlined>
>((props, ref) => <UsersIcon ref={ref} {...props} />);
