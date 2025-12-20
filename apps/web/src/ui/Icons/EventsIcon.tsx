import { ScheduleOutlined } from '@ant-design/icons';
import React from 'react';

export const EventsIcon = React.forwardRef<
  HTMLSpanElement,
  React.ComponentProps<typeof ScheduleOutlined>
>((props, ref) => <ScheduleOutlined ref={ref} {...props} />);
