import { PaginatedResponse } from '@club-social/shared/types';
import { ApiHideProperty } from '@nestjs/swagger';

export class PaginatedResponseDto<T> implements PaginatedResponse<T> {
  @ApiHideProperty()
  public data: T[];

  public total: number;
}
