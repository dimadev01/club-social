import { IsNotEmpty, IsString } from 'class-validator';

import { VoidMovementRequest } from '@application/movements/use-cases/void-movement/void-movement.request';
import { GetOneByIdRequestDto } from '@ui/common/dtos/get-one-dto-request.dto';

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
