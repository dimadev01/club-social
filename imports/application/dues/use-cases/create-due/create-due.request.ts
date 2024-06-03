import { DueCategoryEnum } from '@domain/dues/due.enum';

export interface CreateDueRequest {
  amount: number;
  category: DueCategoryEnum;
  date: string;
  memberIds: string[];
  notes: string | null;
}
