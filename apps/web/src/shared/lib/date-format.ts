import dayjs, { type Dayjs } from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/es';

dayjs.extend(relativeTime);
dayjs.locale('es');

export const DATE_FORMATS = {
  date: 'DD/MM/YYYY',
  dateTime: 'DD/MM/YYYY HH:mm',
  isoDate: 'YYYY-MM-DD',
  monthYear: 'MMMM YYYY',
  time: 'HH:mm',
};

export const DateFormat = {
  date(value: Date | Dayjs | string, format = DATE_FORMATS.date): string {
    return DateFormat.parse(value).format(format);
  },

  dateTime(
    value: Date | Dayjs | string,
    format = DATE_FORMATS.dateTime,
  ): string {
    return DateFormat.date(value, format);
  },

  isoDate(value: Date | Dayjs | string): string {
    return DateFormat.date(value, DATE_FORMATS.isoDate);
  },

  monthYear(value: Date | Dayjs | string): string {
    return DateFormat.date(value, DATE_FORMATS.monthYear);
  },

  parse(value: Date | Dayjs | string): Dayjs {
    return dayjs(value);
  },

  relative(value: Date | Dayjs | string): string {
    return DateFormat.parse(value).fromNow();
  },

  time(value: Date | Dayjs | string): string {
    return DateFormat.date(value, DATE_FORMATS.time);
  },
};
