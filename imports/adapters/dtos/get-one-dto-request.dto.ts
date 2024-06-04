import { IsNotEmpty, IsString } from 'class-validator';

import { FindOneModelById } from '@domain/common/repositories/queryable.repository';

export class GetOneDtoByIdRequestDto implements FindOneModelById {
  @IsNotEmpty()
  @IsString()
  public id!: string;
}
