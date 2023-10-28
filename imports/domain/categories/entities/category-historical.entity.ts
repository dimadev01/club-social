import { IsDate, IsInt, IsOptional } from 'class-validator';

export class CategoryHistorical {
  @IsInt()
  @IsOptional()
  amount: number | null;

  @IsDate()
  date: Date;
}
