import { IsArray, IsNotEmpty, IsString } from 'class-validator';

import { FindManyByIds } from '@application/common/repositories/queryable.repository';

export class GetManyByIdsRequestDto implements FindManyByIds {
  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  public ids!: string[];
}
