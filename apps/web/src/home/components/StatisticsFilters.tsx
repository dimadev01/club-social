import type { Dayjs } from 'dayjs';

import { DateFormats } from '@club-social/shared/lib';
import { DatePicker } from 'antd';

import { getPresets } from '@/ui/DatePicker/datepicker-presets';

interface StatisticsFiltersProps {
  onChange: (dates: [Dayjs, Dayjs] | null) => void;
  value?: [Dayjs, Dayjs];
}

export function StatisticsFilters({ onChange, value }: StatisticsFiltersProps) {
  return (
    <>
      <DatePicker.RangePicker
        format={DateFormats.date}
        onChange={(dates) => {
          if (dates && dates[0] && dates[1]) {
            const [start, end] = dates;
            onChange([start.startOf('day'), end.startOf('day')]);
          } else {
            onChange(null);
          }
        }}
        placeholder={['Fecha desde', 'Fecha hasta']}
        presets={getPresets()}
        value={value ?? undefined}
      />
    </>
  );
}
