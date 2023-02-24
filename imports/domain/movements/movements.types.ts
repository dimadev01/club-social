import { CategoryEnum } from '@domain/categories/categories.enum';

export interface CreateMovement {
  amount: number;
  category: CategoryEnum;
  date: string;
  member: CreateMovementMember | null;
  notes: string | null;
}

export interface CreateMovementMember {
  _id: string;
  firstName: string;
  lastName: string;
}
