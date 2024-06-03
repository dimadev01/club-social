import { IsNotEmpty, IsString } from 'class-validator';

import { GetPendingDuesRequest } from '@application/dues/use-cases/get-pending-dues/get-pending-dues.request';

export class GetPendingDuesRequestDto implements GetPendingDuesRequest {
  @IsNotEmpty()
  @IsString()
  public memberId!: string;
}
