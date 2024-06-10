import { IsNotEmpty, IsString } from 'class-validator';

import { GetOneByIdRequestDto } from '@adapters/common/dtos/get-one-dto-request.dto';
import { VoidMovementRequest } from '@application/movements/use-cases/void-movement/void-movement.request';

export class VoidMovementRequestDto
  extends GetOneByIdRequestDto
  implements VoidMovementRequest
{
  @IsNotEmpty()
  @IsString()
  public voidedBy!: string;

  @IsNotEmpty()
  @IsString()
  public voidReason!: string;
}
