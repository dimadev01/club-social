import type { TextAreaRef } from 'antd/es/input/TextArea';
import type { TextAreaProps } from 'antd/lib/input';

import { Input } from 'antd';
import { forwardRef } from 'react';

import { cn } from '@/shared/lib/utils';

import { COMPONENT_WIDTHS } from './constants';

export const TextArea = forwardRef<TextAreaRef, TextAreaProps>((props, ref) => (
  <Input.TextArea
    className={cn(COMPONENT_WIDTHS.TEXT_AREA, props.className)}
    ref={ref}
    {...props}
  />
));

TextArea.displayName = 'TextArea';
