import { IsNotEmpty, IsString } from 'class-validator';

import { FindOneByIdModelRequest } from '@domain/common/repositories/queryable.repository';

export class GetModelRequestDto implements FindOneByIdModelRequest {
  @IsNotEmpty()
  @IsString()
  public id!: string;
}
