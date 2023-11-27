import { DueCategoryEnum, DueStatusEnum } from '@domain/dues/due.enum';

export class DueGridDto {
  _id: string;

  date: string;

  amount: string;

  category: DueCategoryEnum;

  memberId: string;

  memberName: string;

  membershipMonth: string;

  status: DueStatusEnum;

  isDeleted: boolean;
}
