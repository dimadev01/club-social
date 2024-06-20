import 'dayjs/locale/es';
import dayjs, { Dayjs } from 'dayjs';
import dayjsCustomParseFormat from 'dayjs/plugin/customParseFormat';
import dayjsDuration from 'dayjs/plugin/duration';
import dayjsLocaleData from 'dayjs/plugin/localeData';
import dayjsLocalizedFormat from 'dayjs/plugin/localizedFormat';
import dayjsUtc from 'dayjs/plugin/utc';

import { ValueObject } from '@domain/common/value-objects/value-object';
import { DateFormatEnum } from '@shared/utils/date.utils';

dayjs.extend(dayjsUtc);

dayjs.extend(dayjsLocaleData);

dayjs.extend(dayjsCustomParseFormat);

dayjs.extend(dayjsDuration);

dayjs.extend(dayjsLocalizedFormat);

dayjs.locale('es');

interface IDateTimeVo {
  date: Date;
}

export class DateTimeVo extends ValueObject<IDateTimeVo> {
  protected _dayjs: Dayjs;

  public constructor(props?: dayjs.ConfigType) {
    super({ date: dayjs(props).toDate() });

    this._dayjs = dayjs(this.value.date);
  }

  public get date(): Date {
    return this.value.date;
  }

  public add(value: number, unit: dayjs.ManipulateType) {
    return new DateTimeVo(this._dayjs.add(value, unit));
  }

  public diff(vo: DateTimeVo, unit: dayjs.OpUnitType) {
    return this._dayjs.diff(vo.toDayjs(), unit);
  }

  public equals(vo?: DateTimeVo): boolean {
    if (vo === null || vo === undefined) {
      return false;
    }

    return this._dayjs.isSame(vo.toDayjs());
  }

  public format(format = DateFormatEnum.DDMMYYYY): string {
    return this._dayjs.format(format);
  }

  public isInTheFuture() {
    return this._dayjs.isAfter(dayjs());
  }

  public monthName(): string {
    return this.format(DateFormatEnum.MMMM);
  }

  public startOf(value: dayjs.OpUnitType) {
    return new DateTimeVo(this._dayjs.startOf(value));
  }

  public subtract(value: number, unit: dayjs.ManipulateType) {
    return new DateTimeVo(this._dayjs.subtract(value, unit));
  }

  public toISOString(): string {
    return this._dayjs.toISOString();
  }

  public unix(): number {
    return this._dayjs.unix();
  }

  private toDayjs(): Dayjs {
    return this._dayjs;
  }
}
