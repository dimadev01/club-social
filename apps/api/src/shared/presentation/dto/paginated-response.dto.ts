import { PaginatedResponse } from '@club-social/shared/types';
import { ApiHideProperty } from '@nestjs/swagger';

export class PaginatedResponseDto<
  T,
  TSummary = never,
> implements PaginatedResponse<T, TSummary> {
  @ApiHideProperty()
  public data: T[];

  @ApiHideProperty()
  public extra?: TSummary;

  public total: number;
}
