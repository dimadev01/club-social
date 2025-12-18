import dayjs, { type Dayjs } from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/es';

dayjs.extend(relativeTime);
dayjs.locale('es');

export const DateFormat = {
  date(value: Date | Dayjs | string, format = 'DD/MM/YYYY'): string {
    return dayjs(value).format(format);
  },

  dateTime(value: Date | Dayjs | string, format = 'DD/MM/YYYY HH:mm'): string {
    return dayjs(value).format(format);
  },

  isoDate(value: Date | Dayjs | string): string {
    return DateFormat.date(value, 'YYYY-MM-DD');
  },

  monthYear(value: Date | Dayjs | string): string {
    return dayjs(value).format('MMMM YYYY');
  },

  parse(value: Date | Dayjs | string): Dayjs {
    return dayjs(value);
  },

  relative(value: Date | Dayjs | string): string {
    return dayjs(value).fromNow();
  },

  time(value: Date | Dayjs | string): string {
    return dayjs(value).format('HH:mm');
  },
};
