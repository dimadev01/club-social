import { Input as AntInput, type InputProps, type InputRef } from 'antd';
import { forwardRef } from 'react';

import { cn } from '@/shared/lib/utils';

import { COMPONENT_WIDTHS } from './constants';
import { TextArea } from './TextArea';

const InputWithRef = forwardRef<InputRef, InputProps>((props, ref) => (
  <AntInput
    className={cn(COMPONENT_WIDTHS.INPUT, props.className)}
    ref={ref}
    {...props}
  />
));

InputWithRef.displayName = 'Input';

export const Input = Object.assign(InputWithRef, {
  Search: AntInput.Search,
  TextArea,
});
