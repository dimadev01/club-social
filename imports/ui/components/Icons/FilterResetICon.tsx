import { UndoOutlined } from '@ant-design/icons';
import React from 'react';

import { FilterIcon } from '@ui/components/Icons/FilterIcon';

export const FilterResetIcon = () => (
  <div className="relative">
    <UndoOutlined className="absolute -right-2 -top-2 !text-[10px]" />
    <FilterIcon />
  </div>
);
