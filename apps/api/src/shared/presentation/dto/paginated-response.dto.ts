import { PaginatedDataResultDto } from '@club-social/shared/types';
import { ApiHideProperty } from '@nestjs/swagger';

export class PaginatedDataResponseDto<
  TData,
  TSummary = never,
> implements PaginatedDataResultDto<TData, TSummary> {
  @ApiHideProperty()
  public data: TData[];

  @ApiHideProperty()
  public extra?: TSummary;

  public total: number;
}
