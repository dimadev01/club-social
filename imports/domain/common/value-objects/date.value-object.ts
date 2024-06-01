import 'dayjs/locale/es';
import dayjs, { Dayjs } from 'dayjs';
import dayjsCustomParseFormat from 'dayjs/plugin/customParseFormat';
import dayjsDuration from 'dayjs/plugin/duration';
import dayjsLocaleData from 'dayjs/plugin/localeData';
import dayjsUtc from 'dayjs/plugin/utc';

import { ValueObject } from '@domain/common/value-objects/value-object';
import { DateFormatEnum } from '@shared/utils/date.utils';

dayjs.extend(dayjsUtc);

dayjs.extend(dayjsLocaleData);

dayjs.extend(dayjsCustomParseFormat);

dayjs.extend(dayjsDuration);

dayjs.locale('es');

export class DateVo extends ValueObject<Dayjs> {
  public constructor(value?: dayjs.ConfigType) {
    super(dayjs(value));
  }

  public format(format = DateFormatEnum.DDMMYYYY): string {
    return this.props.format(format);
  }

  public toDate(): Date {
    return this.props.toDate();
  }

  public toISOString(): string {
    return this.props.toISOString();
  }
}
