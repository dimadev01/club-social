import { DueCategoryEnum } from '@domain/dues/due.enum';

export interface GetPriceRequest {
  dueCategory: DueCategoryEnum;
}
