import { IsNotEmpty, IsString } from 'class-validator';

import { FindOneModelByIdRequest } from '@domain/common/repositories/queryable.repository';

export class GetOneModelRequestDto implements FindOneModelByIdRequest {
  @IsNotEmpty()
  @IsString()
  public id!: string;
}
