import dayjs, { Dayjs } from 'dayjs';
import utc from 'dayjs/plugin/utc';

export enum DateFormatEnum {
  DDMMYYYY = 'DD/MM/YYYY',
  Date = 'YYYY-MM-DD',
  DateTime = 'YYYY-MM-DD HH:mm:ss',
  Iso = 'YYYY-MM-DDTHH:mm:ss.SSSZ',
  Time = 'HH:mm:ss',
}

export abstract class DateUtils {
  public static create(
    date?: string | number | Date | dayjs.Dayjs | null | undefined,
    format?: dayjs.OptionType | undefined,
    strict?: boolean | undefined
  ): Dayjs {
    return dayjs(date, format, strict);
  }

  public static extend(): void {
    dayjs.extend(utc);
  }

  public static format(
    date: Date | Dayjs,
    format: DateFormatEnum = DateFormatEnum.Date
  ): string {
    return this.create(date).format(format);
  }

  public static formatUtc(
    date: Date | Dayjs,
    format: DateFormatEnum = DateFormatEnum.Date
  ): string {
    return this.utc(date).format(format);
  }

  public static utc(
    config?: string | number | Date | dayjs.Dayjs | null | undefined,
    format?: string | undefined,
    strict?: boolean | undefined
  ): Dayjs {
    return dayjs.utc(config, format, strict);
  }
}
