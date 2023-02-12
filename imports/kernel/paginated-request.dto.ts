import { IsNotEmpty, IsPositive } from 'class-validator';

export class PaginatedRequestDto {
  @IsPositive()
  @IsNotEmpty()
  page: number;

  @IsPositive()
  @IsNotEmpty()
  pageSize: number;
}
