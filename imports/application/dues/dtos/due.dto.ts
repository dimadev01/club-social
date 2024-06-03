import { DueCategoryEnum, DueStatusEnum } from '@domain/dues/due.enum';

export interface DueDto {
  amount: number;
  category: DueCategoryEnum;
  date: string;
  id: string;
  memberId: string;
  notes: string | null;
  status: DueStatusEnum;
}
