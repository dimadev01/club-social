import type { Dayjs } from 'dayjs';
import type { Ref } from 'react';

import { DateFormats } from '@club-social/shared/lib';
import {
  DatePicker as AntDatePicker,
  type DatePickerProps,
  type GetRef,
} from 'antd';

import { cn } from '@/shared/lib/utils';

import { COMPONENT_WIDTHS } from '../constants';
import { RangePicker } from './RangePicker';

type DatePickerRef = GetRef<typeof AntDatePicker>;

export function DatePickerWithRef<
  ValueType = Dayjs,
  IsMultiple extends boolean = false,
>({
  format = DateFormats.date,
  ref,
  ...props
}: DatePickerProps<ValueType, IsMultiple> & { ref?: Ref<DatePickerRef> }) {
  return (
    <AntDatePicker<ValueType, IsMultiple>
      className={cn(COMPONENT_WIDTHS.DATE_PICKER, props.className)}
      format={format}
      ref={ref}
      {...props}
    />
  );
}

export const DatePicker = Object.assign(DatePickerWithRef, {
  RangePicker,
});
