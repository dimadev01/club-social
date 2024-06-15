import { IsNotEmpty, IsString } from 'class-validator';

import { VoidDueRequest } from '@application/dues/use-cases/void-due/void-due.request';
import { GetOneByIdRequestDto } from '@ui/common/dtos/get-one-dto-request.dto';

export class VoidDueRequestDto
  extends GetOneByIdRequestDto
  implements VoidDueRequest
{
  @IsNotEmpty()
  @IsString()
  public voidedBy!: string;

  @IsNotEmpty()
  @IsString()
  public voidReason!: string;
}
