import { IsNotEmpty, IsString } from 'class-validator';

import { FindByIdModelRequest } from '@domain/common/repositories/queryable.repository';

export class GetModelRequestDto implements FindByIdModelRequest {
  @IsNotEmpty()
  @IsString()
  public id!: string;
}
