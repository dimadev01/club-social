import { IsNotEmpty, IsString } from 'class-validator';

import { FindOneModelByIdRequest } from '@domain/common/repositories/queryable.repository';

export class GetModelRequestDto implements FindOneModelByIdRequest {
  @IsNotEmpty()
  @IsString()
  public id!: string;
}
