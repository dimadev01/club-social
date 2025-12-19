import { UndoOutlined } from '@ant-design/icons';

import { FilterIcon } from './FilterIcon';

export const FilterResetIcon = () => (
  <div className="relative">
    <UndoOutlined className="absolute -top-2 -right-2 text-xs" />
    <FilterIcon />
  </div>
);
