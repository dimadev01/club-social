import dayjs from 'dayjs';

import { DateUtcVo } from '@domain/common/value-objects/date-utc.value-object';

export class BirthDate extends DateUtcVo {
  public constructor(value: string | Date) {
    super(value);
  }

  public getAge(): number {
    return dayjs().diff(this.props.toDate(), 'year');
  }
}
