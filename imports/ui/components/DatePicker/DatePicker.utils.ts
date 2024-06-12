import { TimeRangePickerProps } from 'antd';
import dayjs, { Dayjs } from 'dayjs';

const now = dayjs();

export enum DatePickerPresetEnum {
  LAST_14_DAYS = 'LAST_14_DAYS',
  LAST_30_DAYS = 'LAST_30_DAYS',
  LAST_7_DAYS = 'LAST_7_DAYS',
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

export const DatePickerPresetLabel: {
  [x in DatePickerPresetEnum]: string;
} = {
  [DatePickerPresetEnum.LAST_14_DAYS]: 'Últimos 14 días',
  [DatePickerPresetEnum.LAST_30_DAYS]: 'Últimos 30 días',
  [DatePickerPresetEnum.LAST_7_DAYS]: 'Últimos 7 días',
  [DatePickerPresetEnum.LAST_90_DAYS]: 'Últimos 90 días',
  [DatePickerPresetEnum.LAST_MONTH]: 'Mes pasado',
  [DatePickerPresetEnum.LAST_WEEK]: 'Semana pasada',
  [DatePickerPresetEnum.THIS_MONTH]: 'Este mes',
  [DatePickerPresetEnum.THIS_WEEK]: 'Esta semana',
  [DatePickerPresetEnum.TODAY]: 'Hoy',
  [DatePickerPresetEnum.YESTERDAY]: 'Ayer',
  [DatePickerPresetEnum.THIS_YEAR]: 'Este año',
  [DatePickerPresetEnum.PAST_YEAR]: 'Año pasado',
};

export const DatePickerPreset: {
  [x in DatePickerPresetEnum]: [Dayjs, Dayjs];
} = {
  [DatePickerPresetEnum.TODAY]: [now, now.add(1, 'day')],
  [DatePickerPresetEnum.YESTERDAY]: [now.subtract(1, 'day'), now],
  [DatePickerPresetEnum.THIS_WEEK]: [now.startOf('week'), now],
  [DatePickerPresetEnum.THIS_MONTH]: [now.startOf('month'), now],
  [DatePickerPresetEnum.LAST_WEEK]: [
    now.subtract(1, 'week').startOf('week'),
    now.subtract(1, 'week').endOf('week'),
  ],
  [DatePickerPresetEnum.LAST_MONTH]: [
    now.subtract(1, 'month').startOf('month'),
    now.subtract(1, 'month').endOf('month'),
  ],
  [DatePickerPresetEnum.LAST_7_DAYS]: [now.subtract(7, 'days'), now],
  [DatePickerPresetEnum.LAST_14_DAYS]: [now.subtract(14, 'days'), now],
  [DatePickerPresetEnum.LAST_30_DAYS]: [now.subtract(30, 'days'), now],
  [DatePickerPresetEnum.LAST_90_DAYS]: [now.subtract(90, 'days'), now],
  [DatePickerPresetEnum.THIS_YEAR]: [now.startOf('year'), now],
  [DatePickerPresetEnum.PAST_YEAR]: [
    now.subtract(1, 'year').startOf('year'),
    now.subtract(1, 'year').endOf('year'),
  ],
};

export function getPresets(): TimeRangePickerProps['presets'] {
  return Object.entries(DatePickerPreset).map(([key, value]) => ({
    label: DatePickerPresetLabel[key as DatePickerPresetEnum],
    value,
  }));
}
