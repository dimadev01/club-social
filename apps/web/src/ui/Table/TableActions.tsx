import type { SpaceCompactProps } from 'antd/es/space/Compact';

import { Button, Space, Tooltip } from 'antd';

import { cn } from '@/shared/lib/utils';

import { FilterClearIcon } from '../Icons/FilterClearIcon';
import { FilterResetIcon } from '../Icons/FilterResetICon';

interface Props extends SpaceCompactProps {
  clearFilters: () => void;
  resetFilters: () => void;
}

export function TableActions({
  className,
  clearFilters,
  resetFilters,
  ...props
}: Props) {
  return (
    <Space.Compact className={cn('ml-auto', className)} {...props}>
      <Tooltip title="Filtros por defecto">
        <Button icon={<FilterResetIcon />} onClick={resetFilters} type="text" />
      </Tooltip>
      <Tooltip title="Eliminar filtros">
        <Button icon={<FilterClearIcon />} onClick={clearFilters} type="text" />
      </Tooltip>
    </Space.Compact>
  );
}
