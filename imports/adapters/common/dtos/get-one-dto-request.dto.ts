import { IsNotEmpty, IsString } from 'class-validator';

import { FindOneById } from '@domain/common/repositories/queryable.repository';

export class GetOneByIdRequestDto implements FindOneById {
  @IsNotEmpty()
  @IsString()
  public id!: string;
}
