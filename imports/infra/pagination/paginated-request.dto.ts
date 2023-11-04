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

  @IsString()
  @IsNotEmpty()
  public sortField: string;

  @IsString()
  @IsNotEmpty()
  public sortOrder: SortOrder;
}
