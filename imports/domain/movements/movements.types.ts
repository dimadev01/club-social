import { CategoryEnum } from '@domain/categories/categories.enum';

export interface CreateMovement {
  amount: number;
  category: CategoryEnum;
  date: string;
  memberId: string | null;
  notes: string | null;
}
