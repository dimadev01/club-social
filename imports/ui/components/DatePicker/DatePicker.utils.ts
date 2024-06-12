import { TimeRangePickerProps } from 'antd';
import dayjs from 'dayjs';

export function getPresets() {
  const now = dayjs();

  const presets: TimeRangePickerProps['presets'] = [
    { label: 'Hoy', value: [now, now.add(1, 'day')] },
    {
      label: 'Ayer',
      value: [now.subtract(1, 'day'), now],
    },
    {
      label: 'Esta semana',
      value: [now.startOf('week'), now],
    },
    {
      label: 'Este mes',
      value: [now.startOf('month'), now],
    },
    {
      label: 'Semana pasada',
      value: [
        now.subtract(1, 'week').startOf('week'),
        now.subtract(1, 'week').endOf('week'),
      ],
    },
    {
      label: 'Mes pasado',
      value: [
        now.subtract(1, 'month').startOf('month'),
        now.subtract(1, 'month').endOf('month'),
      ],
    },
    { label: 'Últimos 7 días', value: [now.subtract(7, 'days'), now] },
    { label: 'Últimos 14 días', value: [now.subtract(14, 'days'), now] },
    { label: 'Últimos 30 días', value: [now.subtract(30, 'days'), now] },
    { label: 'Últimos 90 días', value: [now.subtract(90, 'days'), now] },
  ];

  return presets;
}
