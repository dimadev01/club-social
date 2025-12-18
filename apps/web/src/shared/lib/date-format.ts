import dayjs from 'dayjs';

export const DateFormat = {
  date(value: Date | string): string {
    return dayjs(value).format('DD/MM/YYYY');
  },

  dateTime(value: Date | string): string {
    return dayjs(value).format('DD/MM/YYYY HH:mm');
  },

  format(value: Date | string, pattern: string): string {
    return dayjs(value).format(pattern);
  },

  monthYear(value: Date | string): string {
    return dayjs(value).format('MMMM YYYY');
  },

  relative(value: Date | string): string {
    return dayjs(value).fromNow();
  },

  time(value: Date | string): string {
    return dayjs(value).format('HH:mm');
  },
};
