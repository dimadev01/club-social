import { MovementCategory } from '@domain/movements/movements.enum';

export interface CreateMovement {
  amount: number;
  category: MovementCategory;
  date: string;
  member: CreateMovementMember | null;
  notes: string | null;
}

export interface CreateMovementMember {
  _id: string;
  firstName: string;
  lastName: string;
}
