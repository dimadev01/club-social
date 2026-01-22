import type { FilterDropdownProps } from 'antd/es/table/interface';

import { Card } from 'antd';

import { Input } from '../Input';

interface TableSearchFilterDropdownProps extends FilterDropdownProps {
  placeholder?: string;
  title?: string;
}

export function TableSearchFilterDropdown({
  confirm,
  placeholder = 'Buscar...',
  selectedKeys,
  setSelectedKeys,
  title = 'Buscar',
}: TableSearchFilterDropdownProps) {
  const value = selectedKeys[0] as string | undefined;

  return (
    <Card size="small" title={title}>
      <Input.Search
        allowClear
        onChange={(e) => {
          const newValue = e.target.value;
          setSelectedKeys(newValue ? [newValue] : []);
        }}
        onClear={() => {
          setSelectedKeys([]);
          confirm({ closeDropdown: true });
        }}
        onSearch={() => confirm({ closeDropdown: true })}
        placeholder={placeholder}
        value={value}
      />
    </Card>
  );
}
