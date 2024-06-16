import { CloseOutlined } from '@ant-design/icons';
import React from 'react';

import { FilterIcon } from '@ui/components/Icons/FilterIcon';

export const FilterClearIcon = () => (
  <div className="relative">
    <CloseOutlined className="absolute -right-2 -top-2 !text-[10px]" />
    <FilterIcon />
  </div>
);
