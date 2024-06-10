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

export class DateVo extends ValueObject<Dayjs> {
  public constructor(value?: dayjs.ConfigType) {
    super(dayjs(value));
  }

  public format(format = DateFormatEnum.DDMMYYYY): string {
    return this.props.format(format);
  }

  public monthName(): string {
    return this.format(DateFormatEnum.MMMM);
  }

  public startOf(value: dayjs.OpUnitType) {
    return new DateVo(this.props.startOf(value));
  }

  public toDate(): Date {
    return this.props.toDate();
  }

  public toISOString(): string {
    return this.props.toISOString();
  }
}
