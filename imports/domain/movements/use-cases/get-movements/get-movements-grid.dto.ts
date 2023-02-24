import { CategoryEnum } from '@domain/categories/categories.enum';

export class MovementGridDto {
  _id: string;

  date: string;

  amount: string;

  category: CategoryEnum;

  details: string;
}
