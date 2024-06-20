import { DateVo } from '@domain/common/value-objects/date.value-object';

export class BirthDate extends DateVo {
  public constructor(value: string | Date) {
    super(value);
  }

  public getAge(): number {
    return this.diff(new DateVo(), 'year');
  }
}
