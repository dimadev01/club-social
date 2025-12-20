import { UndoOutlined } from '@ant-design/icons';
import React from 'react';

import { FilterIcon } from './FilterIcon';

export const FilterResetIcon = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>((props, ref) => (
  <div className="relative" ref={ref} {...props}>
    <UndoOutlined className="absolute -top-2 -right-2 text-xs" />
    <FilterIcon />
  </div>
));
