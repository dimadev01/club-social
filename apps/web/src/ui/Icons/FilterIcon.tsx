import { FilterOutlined } from '@ant-design/icons';
import React from 'react';

export const FilterIcon = React.forwardRef<
  HTMLSpanElement,
  React.ComponentProps<typeof FilterOutlined>
>((props, ref) => <FilterOutlined ref={ref} {...props} />);
