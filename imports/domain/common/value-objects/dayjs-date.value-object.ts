import 'dayjs/locale/es';
import dayjs, { Dayjs } from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import localeData from 'dayjs/plugin/localeData';
import utc from 'dayjs/plugin/utc';

import { DateFormatEnum } from '@shared/utils/date.utils';

dayjs.extend(utc);

dayjs.extend(localeData);

dayjs.extend(customParseFormat);

dayjs.locale('es');

export class DayjsDate {
  private _date: Dayjs;

  public constructor(date?: dayjs.ConfigType) {
    this._date = dayjs(date);
  }

  public static utc(date: dayjs.ConfigType): DayjsDate {
    return new DayjsDate(date).utc();
  }

  public dayjs(): Dayjs {
    return this._date;
  }

  public format(format: DateFormatEnum = DateFormatEnum.DDMMYYYY): string {
    return this._date.format(format);
  }

  public toDate(): Date {
    return this._date.toDate();
  }

  public toISOString(): string {
    return this._date.toISOString();
  }

  public utc(): DayjsDate {
    this._date = this._date.utc();

    return this;
  }
}
