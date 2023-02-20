import { MovementCategory } from '@domain/movements/movements.enum';

export class GetMovementResponseDto {
  _id: string;

  date: string;

  amount: number;

  category: MovementCategory;

  notes: string | null;
}
