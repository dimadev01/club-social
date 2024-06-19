import dayjs from 'dayjs';

import { DateTimeVo } from '@domain/common/value-objects/date-time.value-object';
import { ValueObject } from '@domain/common/value-objects/value-object';
import { DateFormatEnum } from '@shared/utils/date.utils';

export class DateVo extends DateTimeVo {
  public constructor(value?: dayjs.ConfigType) {
    super(dayjs.utc(value));
  }

  public equals(vo?: ValueObject<dayjs.Dayjs> | undefined): boolean {
    if (vo === null || vo === undefined) {
      return false;
    }

    return this.props.isSame(vo.props);
  }

  public isInTheFuture() {
    return new DateTimeVo(
      this.props.format(DateFormatEnum.DATE),
    ).isInTheFuture();
  }
}
