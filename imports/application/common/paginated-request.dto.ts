import { SortOrder } from 'antd/es/table/interface';
import { IsNotEmpty, IsOptional, IsPositive, IsString } from 'class-validator';

export class PaginatedRequestDto {
  @IsPositive()
  @IsNotEmpty()
  page: number;

  @IsPositive()
  @IsNotEmpty()
  pageSize: number;

  @IsString()
  search: string;

  sortField: string | string[];

  @IsString()
  sortOrder: SortOrder;

  @IsOptional()
  filters: Record<string, string | string[] | null> | undefined;
}
