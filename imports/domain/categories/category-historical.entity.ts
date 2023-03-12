import { IsDate, IsInt } from 'class-validator';

export class CategoryHistorical {
  @IsInt()
  amount: number;

  @IsDate()
  date: Date;
}
