import { PaginatedRequestSort, SortOrder } from '@club-social/shared/types';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

const SortMap = {
  ascend: SortOrder.ASC,
  descend: SortOrder.DESC,
} as const;

export class PaginatedRequestSortDto implements PaginatedRequestSort {
  @IsNotEmpty()
  @IsString()
  public field: string;

  @IsNotEmpty()
  @Transform(({ value }) => SortMap[value as keyof typeof SortMap])
  public order: SortOrder;
}
