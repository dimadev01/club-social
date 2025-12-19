import { Button, Space, Tooltip } from 'antd';

import { FilterClearIcon } from '../Icons/FilterClearIcon';
import { FilterResetIcon } from '../Icons/FilterResetICon';

interface Props {
  clearFilters: () => void;
  resetFilters: () => void;
}

export function TableActions({ clearFilters, resetFilters }: Props) {
  return (
    <Space.Compact>
      <Tooltip title="Filtros por defecto">
        <Button
          icon={<FilterResetIcon />}
          onClick={resetFilters}
          type="default"
        />
      </Tooltip>
      <Tooltip title="Eliminar filtros">
        <Button
          icon={<FilterClearIcon />}
          onClick={clearFilters}
          type="default"
        />
      </Tooltip>
    </Space.Compact>
  );
}
