import { CategoryEnum } from '@domain/categories/categories.enum';

export class MovementByMemberGridDto {
  _id: string;

  date: string;

  amount: string;

  category: CategoryEnum;

  memberId: string | null;
}
