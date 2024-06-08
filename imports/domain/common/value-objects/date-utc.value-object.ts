import dayjs from 'dayjs';

import { DateVo } from '@domain/common/value-objects/date.value-object';

export class DateUtcVo extends DateVo {
  public constructor(value?: dayjs.ConfigType) {
    super(dayjs.utc(value));
  }
}
