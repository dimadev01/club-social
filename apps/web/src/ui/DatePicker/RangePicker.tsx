import type { RangePickerProps } from 'antd/es/date-picker';

import { DatePicker, type GetRef } from 'antd';
import { forwardRef } from 'react';

type RangePickerRef = GetRef<typeof DatePicker.RangePicker>;

export const RangePicker = forwardRef<RangePickerRef, RangePickerProps>(
  (props, ref) => <DatePicker.RangePicker ref={ref} {...props} />,
);

RangePicker.displayName = 'RangePicker';
