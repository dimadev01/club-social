import type { SpaceCompactProps } from 'antd/es/space/Compact';

import { Space } from 'antd';

import { cn } from '@/shared/lib/utils';

import { Button } from '../Button';
import { FilterClearIcon } from '../Icons/FilterClearIcon';
import { FilterResetIcon } from '../Icons/FilterResetIcon';

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
      <Button
        icon={<FilterResetIcon />}
        onClick={resetFilters}
        tooltip="Filtros por defecto"
        type="text"
      />
      <Button
        icon={<FilterClearIcon />}
        onClick={clearFilters}
        tooltip="Eliminar filtros"
        type="text"
      />
    </Space.Compact>
  );
}
