import { IsNotEmpty, IsPositive, IsString } from 'class-validator';

export class PaginatedRequestDto {
  @IsPositive()
  @IsNotEmpty()
  page: number;

  @IsPositive()
  @IsNotEmpty()
  pageSize: number;

  @IsNotEmpty()
  @IsString()
  search: string;
}
