import dayjs, { Dayjs } from 'dayjs';

export enum DateFormats {
  DD_MM_YYYY = 'DD/MM/YYYY',
  Date = 'YYYY-MM-DD',
  DateTime = 'YYYY-MM-DD HH:mm:ss',
  Time = 'HH:mm:ss',
}

export abstract class DateUtils {
  static format(
    date: Date | Dayjs,
    format: DateFormats = DateFormats.Date
  ): string {
    return dayjs(date).format(format);
  }

  static formatUtc(
    date: Date | Dayjs,
    format: DateFormats = DateFormats.Date
  ): string {
    return dayjs.utc(date).format(format);
  }
}
