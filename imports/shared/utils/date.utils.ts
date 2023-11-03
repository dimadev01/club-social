import dayjs, { Dayjs } from 'dayjs';
import utc from 'dayjs/plugin/utc';

export enum DateFormatEnum {
  DD_MM_YYYY = 'DD/MM/YYYY',
  Date = 'YYYY-MM-DD',
  DateTime = 'YYYY-MM-DD HH:mm:ss',
  Iso = 'YYYY-MM-DDTHH:mm:ss.SSSZ',
  Time = 'HH:mm:ss',
}

export abstract class DateUtils {
  static format(
    date: Date | Dayjs,
    format: DateFormatEnum = DateFormatEnum.Date
  ): string {
    return dayjs(date).format(format);
  }

  static formatUtc(
    date: Date | Dayjs,
    format: DateFormatEnum = DateFormatEnum.Date
  ): string {
    return dayjs.utc(date).format(format);
  }

  static extend(): void {
    dayjs.extend(utc);
  }
}
