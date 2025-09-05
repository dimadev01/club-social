import { DueCategoryEnum } from '@domain/dues/due.enum';

export interface GetPriceByDueCategoryRequest {
  dueCategory: DueCategoryEnum;
}
