import type { Ref } from 'react';

import {
  InputNumber as AntInputNumber,
  type GetRef,
  type InputNumberProps,
} from 'antd';

import { cn } from '@/shared/lib/utils';

import { COMPONENT_WIDTHS } from './constants';

type InputNumberRef = GetRef<typeof AntInputNumber>;

export function InputNumber<T extends number | string = number>({
  ref,
  ...props
}: InputNumberProps<T> & { ref?: Ref<InputNumberRef> }) {
  return (
    <AntInputNumber<T>
      className={cn(COMPONENT_WIDTHS.INPUT_AMOUNT, props.className)}
      ref={ref}
      {...props}
    />
  );
}
