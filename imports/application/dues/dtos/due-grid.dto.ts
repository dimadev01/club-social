import { DueCategoryEnum, DueStatusEnum } from '@domain/dues/due.enum';

export interface DueGridDto {
  amount: number;
  category: DueCategoryEnum;
  date: string;
  id: string;
  isDeleted: boolean;
  memberId: string;
  memberName: string;
  status: DueStatusEnum;
}
