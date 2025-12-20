import type { TimeRangePickerProps } from 'antd';

import dayjs, { Dayjs } from 'dayjs';

export enum DatePickerPresetEnum {
  LAST_7_DAYS = 'LAST_7_DAYS',
  LAST_14_DAYS = 'LAST_14_DAYS',
  LAST_30_DAYS = 'LAST_30_DAYS',
  LAST_90_DAYS = 'LAST_90_DAYS',
  LAST_MONTH = 'LAST_MONTH',
  LAST_WEEK = 'LAST_WEEK',
  PAST_YEAR = 'PAST_YEAR',
  THIS_MONTH = 'THIS_MONTH',
  THIS_WEEK = 'THIS_WEEK',
  THIS_YEAR = 'THIS_YEAR',
  TODAY = 'TODAY',
  YESTERDAY = 'YESTERDAY',
}

export const DatePickerPresetLabel: Record<DatePickerPresetEnum, string> = {
  [DatePickerPresetEnum.LAST_7_DAYS]: 'Últimos 7 días',
  [DatePickerPresetEnum.LAST_14_DAYS]: 'Últimos 14 días',
  [DatePickerPresetEnum.LAST_30_DAYS]: 'Últimos 30 días',
  [DatePickerPresetEnum.LAST_90_DAYS]: 'Últimos 90 días',
  [DatePickerPresetEnum.LAST_MONTH]: 'Mes pasado',
  [DatePickerPresetEnum.LAST_WEEK]: 'Semana pasada',
  [DatePickerPresetEnum.PAST_YEAR]: 'Año pasado',
  [DatePickerPresetEnum.THIS_MONTH]: 'Este mes',
  [DatePickerPresetEnum.THIS_WEEK]: 'Esta semana',
  [DatePickerPresetEnum.THIS_YEAR]: 'Este año',
  [DatePickerPresetEnum.TODAY]: 'Hoy',
  [DatePickerPresetEnum.YESTERDAY]: 'Ayer',
};

export const generatePresets = (): Record<
  DatePickerPresetEnum,
  [Dayjs, Dayjs]
> => {
  const today = dayjs().startOf('day');

  return {
    // "Last N days" includes today and goes back N-1 full days
    // Example: "Last 7 days" = today + 6 days before = 7 full days
    [DatePickerPresetEnum.LAST_7_DAYS]: [today.subtract(6, 'days'), today],
    [DatePickerPresetEnum.LAST_14_DAYS]: [today.subtract(13, 'days'), today],
    [DatePickerPresetEnum.LAST_30_DAYS]: [today.subtract(29, 'days'), today],
    [DatePickerPresetEnum.LAST_90_DAYS]: [today.subtract(89, 'days'), today],

    // Complete periods (full month/week/year)
    [DatePickerPresetEnum.LAST_MONTH]: [
      today.subtract(1, 'month').startOf('month'),
      today.subtract(1, 'month').endOf('month'),
    ],
    [DatePickerPresetEnum.LAST_WEEK]: [
      today.subtract(1, 'week').startOf('week'),
      today.subtract(1, 'week').endOf('week'),
    ],
    [DatePickerPresetEnum.PAST_YEAR]: [
      today.subtract(1, 'year').startOf('year'),
      today.subtract(1, 'year').endOf('year'),
    ],

    // Current period from start until today (partial period)
    [DatePickerPresetEnum.THIS_MONTH]: [today.startOf('month'), today],
    [DatePickerPresetEnum.THIS_WEEK]: [today.startOf('week'), today],
    [DatePickerPresetEnum.THIS_YEAR]: [today.startOf('year'), today],

    // Single days
    [DatePickerPresetEnum.TODAY]: [today, today],
    [DatePickerPresetEnum.YESTERDAY]: [
      today.subtract(1, 'day'),
      today.subtract(1, 'day'),
    ],
  };
};

export function getPresets(): TimeRangePickerProps['presets'] {
  return Object.entries(generatePresets()).map(([key, value]) => ({
    label: DatePickerPresetLabel[key as DatePickerPresetEnum],
    value,
  }));
}
