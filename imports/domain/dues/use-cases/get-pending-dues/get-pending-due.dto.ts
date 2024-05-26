import { DueCategoryEnum, DueStatusEnum } from '@domain/dues/due.enum';

export interface GetPendingDueResponseDto {
  _id: string;
  amount: number;
  amountFormatted: string;
  category: DueCategoryEnum;
  date: string;
  memberId: string;
  membershipMonth: string;
  status: DueStatusEnum;
}
