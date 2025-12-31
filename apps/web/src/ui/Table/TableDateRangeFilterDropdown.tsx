import type { FilterDropdownProps } from 'antd/es/table/interface';
import type { Dayjs } from 'dayjs';

import { DateFormat } from '@club-social/shared/lib';
import { useMemo } from 'react';

import { TableDateRangeFilter } from './TableDateRangeFilter';

interface TableDateRangeFilterDropdownProps extends FilterDropdownProps {
  format?: 'date' | 'datetime';
}

export function TableDateRangeFilterDropdown({
  close,
  confirm,
  format = 'date',
  selectedKeys,
  setSelectedKeys,
}: TableDateRangeFilterDropdownProps) {
  // Convert selectedKeys (strings) back to Dayjs objects
  const value: [Dayjs, Dayjs] | undefined = useMemo(() => {
    if (selectedKeys.length === 2) {
      return [
        DateFormat.parse(selectedKeys[0] as string),
        DateFormat.parse(selectedKeys[1] as string),
      ];
    }

    return undefined;
  }, [selectedKeys]);

  const handleChange = (dates: [Dayjs, Dayjs] | null) => {
    if (dates) {
      // Normalize to day boundaries (00:00:00)
      // Backend DateRange value object handles the +1 day logic for half-open intervals
      const start = dates[0].startOf('day');
      const end = dates[1].startOf('day');

      // Format based on the format prop
      const formattedKeys =
        format === 'datetime'
          ? [start.toISOString(), end.toISOString()]
          : [DateFormat.isoDate(start), DateFormat.isoDate(end)];

      setSelectedKeys(formattedKeys);
    } else {
      setSelectedKeys([]);
    }

    confirm({ closeDropdown: true });
  };

  return (
    <TableDateRangeFilter
      onChange={handleChange}
      onClose={() => close()}
      value={value}
    />
  );
}
