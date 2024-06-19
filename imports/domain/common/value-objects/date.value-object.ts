import dayjs from 'dayjs';

import { DateTimeVo } from '@domain/common/value-objects/date-time.value-object';
import { DateFormatEnum } from '@shared/utils/date.utils';

export class DateVo extends DateTimeVo {
  public constructor(value?: dayjs.ConfigType) {
    super(dayjs.utc(value));
  }

  public isInTheFuture() {
    return new DateTimeVo(
      this._dayjs.format(DateFormatEnum.DATE),
    ).isInTheFuture();
  }
}
