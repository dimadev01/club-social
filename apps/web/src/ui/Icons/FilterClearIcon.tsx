import { CloseOutlined } from '@ant-design/icons';

import { FilterIcon } from './FilterIcon';

export const FilterClearIcon = () => (
  <div className="relative">
    <CloseOutlined className="absolute -top-2 -right-2 text-xs" />
    <FilterIcon />
  </div>
);
