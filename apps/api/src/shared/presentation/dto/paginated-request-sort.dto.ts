import type {
  PaginatedRequestSort,
  SortOrder,
} from '@club-social/shared/types';

import { IsNotEmpty, IsString } from 'class-validator';

export class PaginatedRequestSortDto implements PaginatedRequestSort {
  @IsNotEmpty()
  @IsString()
  public field: string;

  @IsNotEmpty()
  public order: SortOrder;
}
