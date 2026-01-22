import type { TextAreaRef } from 'antd/es/input/TextArea';
import type { TextAreaProps } from 'antd/lib/input';

import { Input } from 'antd';
import { forwardRef } from 'react';

import { cn } from '@/shared/lib/utils';

export const TextArea = forwardRef<TextAreaRef, TextAreaProps>((props, ref) => (
  <Input.TextArea
    className={cn('w-full sm:w-80', props.className)}
    ref={ref}
    {...props}
  />
));

TextArea.displayName = 'TextArea';
