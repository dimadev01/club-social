import { SortOrder } from 'antd/es/table/interface';
import { IsNotEmpty, IsObject, IsPositive, IsString } from 'class-validator';

export class PaginatedRequestDto {
  @IsObject()
  public filters: Record<string, string[] | null>;

  @IsPositive()
  @IsNotEmpty()
  public page: number;

  @IsPositive()
  @IsNotEmpty()
  public pageSize: number;

  @IsString()
  public search: string;

  @IsNotEmpty()
  @IsString()
  public sortField: string;

  @IsNotEmpty()
  @IsString()
  public sortOrder: SortOrder;
}
