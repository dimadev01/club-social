import { IsNotEmpty, IsString } from 'class-validator';

import { GetModelRequest } from '@domain/common/requests/get-model.request';

export class GetModelRequestDto implements GetModelRequest {
  @IsNotEmpty()
  @IsString()
  public id!: string;
}
