import { IsNotEmpty, IsString } from 'class-validator';

import { GetModelRequest } from '@domain/common/get-model.request';

export class GetModelRequestDto implements GetModelRequest {
  @IsNotEmpty()
  @IsString()
  public id!: string;
}
