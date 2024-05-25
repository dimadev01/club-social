import 'dayjs/locale/es';
import dayjs, { Dayjs } from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import localeData from 'dayjs/plugin/localeData';
import utc from 'dayjs/plugin/utc';

export enum DateFormatEnum {
  DDMMYYYY = 'DD/MM/YYYY',
  Date = 'YYYY-MM-DD',
  DateTime = 'YYYY-MM-DD HH:mm:ss',
  Iso = 'YYYY-MM-DDTHH:mm:ss.SSSZ',
  MMMM_YYYY = 'MMMM YYYY',
  Time = 'HH:mm:ss',
}

export abstract class DateUtils {
  public static c(
    date?: dayjs.ConfigType,
    format?: dayjs.OptionType,
    locale?: string,
    strict?: boolean,
  ): Dayjs {
    return dayjs(date, format, locale, strict);
  }

  public static extend(): void {
    dayjs.extend(utc);

    dayjs.extend(localeData);

    dayjs.extend(customParseFormat);

    dayjs.locale('es');
  }

  public static format(
    date: Date | Dayjs,
    format: DateFormatEnum = DateFormatEnum.DDMMYYYY,
  ): string {
    return this.c(date).format(format);
  }

  public static formatUtc(
    date: Date | Dayjs | string,
    format: DateFormatEnum = DateFormatEnum.DDMMYYYY,
  ): string {
    return this.utc(date).format(format);
  }

  public static months() {
    return dayjs.months();
  }

  public static utc(
    config?: string | number | Date | dayjs.Dayjs | null | undefined,
    format?: string | undefined,
    strict?: boolean | undefined,
  ): Dayjs {
    return dayjs.utc(config, format, strict);
  }
}
