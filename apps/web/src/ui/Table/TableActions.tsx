import { CloseOutlined, RedoOutlined } from '@ant-design/icons';
import { Button, Space, Tooltip } from 'antd';

interface Props {
  clearFilters: () => void;
  resetFilters: () => void;
}

export function TableActions({ clearFilters, resetFilters }: Props) {
  return (
    <Space.Compact>
      <Tooltip title="Filtros por defecto">
        <Button icon={<RedoOutlined />} onClick={resetFilters} type="default" />
      </Tooltip>
      <Tooltip title="Eliminar filtros">
        <Button
          icon={<CloseOutlined />}
          onClick={clearFilters}
          type="default"
        />
      </Tooltip>
    </Space.Compact>
  );
}
