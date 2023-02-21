import { MovementCategory } from '@domain/movements/movements.enum';

export class GetMovementResponseDto {
  _id: string;

  date: string;

  amount: number;

  amountFormatted: string;

  category: MovementCategory;

  notes: string | null;
}
