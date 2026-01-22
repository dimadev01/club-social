import type { Ref } from 'react';

import {
  InputNumber as AntInputNumber,
  type GetRef,
  type InputNumberProps,
} from 'antd';

import { cn } from '@/shared/lib/utils';

type InputNumberRef = GetRef<typeof AntInputNumber>;

export function InputNumber<T extends number | string = number>({
  ref,
  ...props
}: InputNumberProps<T> & { ref?: Ref<InputNumberRef> }) {
  return (
    <AntInputNumber<T>
      className={cn('w-full sm:w-32', props.className)}
      ref={ref}
      {...props}
    />
  );
}
