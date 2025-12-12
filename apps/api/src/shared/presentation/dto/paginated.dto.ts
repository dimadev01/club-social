import { ApiHideProperty } from '@nestjs/swagger';

export class PaginatedDto<T> {
  @ApiHideProperty()
  public data: T[];

  public total: number;
}
