import type { Dayjs } from 'dayjs';

import { Card, DatePicker, Space } from 'antd';
import { useMemo } from 'react';

import { DateFormats } from '@/shared/lib/date-format';

import { getPresets } from '../DatePicker/datepicker-presets';

interface TableDateRangeFilterProps {
  onChange: (dates: [Dayjs, Dayjs] | null) => void;
  onClose?: () => void;
  presets?: boolean;
  value?: [Dayjs, Dayjs];
}

export function TableDateRangeFilter({
  onChange,
  onClose,
  presets = true,
  value,
}: TableDateRangeFilterProps) {
  const presetOptions = useMemo(
    () => (presets ? getPresets() : undefined),
    [presets],
  );

  return (
    <Card size="small" title="Filtro de fecha">
      <Space className="flex-1" vertical>
        <DatePicker.RangePicker
          format={DateFormats.date}
          onChange={(dates) => {
            if (dates && dates[0] && dates[1]) {
              onChange([dates[0], dates[1]]);
            } else {
              onChange(null);
            }

            onClose?.();
          }}
          presets={presetOptions}
          value={value}
        />
      </Space>
    </Card>
  );
}
