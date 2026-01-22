import { Input as AntInput, type InputProps, type InputRef } from 'antd';
import { forwardRef } from 'react';

import { cn } from '@/shared/lib/utils';

import { TextArea } from './TextArea';

const InputWithRef = forwardRef<InputRef, InputProps>((props, ref) => (
  <AntInput
    className={cn('w-full sm:w-auto', props.className)}
    ref={ref}
    {...props}
  />
));

InputWithRef.displayName = 'Input';

export const Input = Object.assign(InputWithRef, {
  Search: AntInput.Search,
  TextArea,
});
