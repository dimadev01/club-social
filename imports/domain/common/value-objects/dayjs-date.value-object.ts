import 'dayjs/locale/es';
import dayjs, { Dayjs } from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import localeData from 'dayjs/plugin/localeData';
import utc from 'dayjs/plugin/utc';

import { DateVo } from '@domain/common/value-objects/date.value-object';

dayjs.extend(utc);

dayjs.extend(localeData);

dayjs.extend(customParseFormat);

dayjs.locale('es');

export class DayjsDate extends DateVo<Dayjs> {
  public constructor(value?: dayjs.ConfigType) {
    super(dayjs(value));
  }

  public static utc(date?: dayjs.ConfigType): DayjsDate {
    return new this(date).utc();
  }

  public format(): string {
    throw new Error('Method not implemented.');
  }

  public toDate(): Date {
    return this.date.toDate();
  }

  public toISOString(): string {
    throw new Error('Method not implemented.');
  }

  public utc(): this {
    this.date = this.date.utc();

    return this;
  }
}
