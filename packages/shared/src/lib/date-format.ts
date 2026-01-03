import dayjs, { type Dayjs } from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/es';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
dayjs.extend(relativeTime);
dayjs.locale('es');

export const DateFormats = {
  date: 'DD/MM/YYYY',
  dateTime: 'DD/MM/YYYY HH:mm',
  isoDate: 'YYYY-MM-DD',
  isoMonth: 'YYYY-MM',
  monthShort: 'MMM',
  monthYear: 'MMMM YYYY',
  time: 'HH:mm',
} as const;

export type DateFormats = (typeof DateFormats)[keyof typeof DateFormats];

export const DateFormat = {
  date(
    value: Date | Dayjs | string,
    format: DateFormats = DateFormats.date,
  ): string {
    return DateFormat.parse(value).format(format);
  },

  dateTime(
    value: Date | Dayjs | string,
    format = DateFormats.dateTime,
  ): string {
    return DateFormat.date(value, format);
  },

  format(value: Date | Dayjs | string, format: DateFormats): string {
    return DateFormat.date(value, format);
  },

  isoDate(value: Date | Dayjs | string): string {
    return DateFormat.date(value, DateFormats.isoDate);
  },

  isoMonth(value: Date | Dayjs | string): string {
    return DateFormat.date(value, DateFormats.isoMonth);
  },

  monthNameShort(value: Date | Dayjs | string): string {
    return DateFormat.date(value, DateFormats.monthShort);
  },

  monthYearName(value: Date | Dayjs | string): string {
    return DateFormat.date(value, DateFormats.monthYear);
  },

  parse(value?: Date | Dayjs | string): Dayjs {
    return dayjs(value);
  },

  relative(value: Date | Dayjs | string): string {
    return DateFormat.parse(value).fromNow();
  },

  time(value: Date | Dayjs | string): string {
    return DateFormat.date(value, DateFormats.time);
  },

  today(): string {
    return DateFormat.date(new Date(), DateFormats.isoDate);
  },
};
