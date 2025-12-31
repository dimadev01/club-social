import { TagsOutlined } from '@ant-design/icons';
import React from 'react';

export const PricingIcon = React.forwardRef<
  HTMLSpanElement,
  React.ComponentProps<typeof TagsOutlined>
>((props, ref) => <TagsOutlined ref={ref} {...props} />);
