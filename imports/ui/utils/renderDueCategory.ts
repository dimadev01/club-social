import { DateUtcVo } from '@domain/common/value-objects/date-utc.value-object';
import { DueCategoryEnum, DueCategoryLabel } from '@domain/dues/due.enum';

export function renderDueCategoryLabel(
  category: DueCategoryEnum,
  date: string,
) {
  if (category === DueCategoryEnum.MEMBERSHIP) {
    return `${DueCategoryLabel[category]} (${new DateUtcVo(date).monthName()})`;
  }

  return DueCategoryLabel[category];
}
