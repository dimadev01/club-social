import { MovementCategory } from '@domain/movements/movements.enum';

export class MovementGridDto {
  _id: string;

  date: string;

  amount: string;

  category: MovementCategory;

  details: string;
}
