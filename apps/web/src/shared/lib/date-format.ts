import dayjs, { type Dayjs } from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/es';

dayjs.extend(relativeTime);
dayjs.locale('es');

export const DateFormats = {
  date: 'DD/MM/YYYY',
  dateTime: 'DD/MM/YYYY HH:mm',
  isoDate: 'YYYY-MM-DD',
  month: 'MMMM',
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

  isoDate(value: Date | Dayjs | string): string {
    return DateFormat.date(value, DateFormats.isoDate);
  },

  month(value: Date | Dayjs | string): string {
    return DateFormat.date(value, DateFormats.month);
  },

  monthYear(value: Date | Dayjs | string): string {
    return DateFormat.date(value, DateFormats.monthYear);
  },

  parse(value: Date | Dayjs | string): Dayjs {
    return dayjs(value);
  },

  relative(value: Date | Dayjs | string): string {
    return DateFormat.parse(value).fromNow();
  },

  time(value: Date | Dayjs | string): string {
    return DateFormat.date(value, DateFormats.time);
  },
};
