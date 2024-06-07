import { IsNotEmpty, IsString } from 'class-validator';

import { GetOneByIdRequestDto } from '@adapters/common/dtos/get-one-dto-request.dto';
import { VoidDueRequest } from '@application/dues/use-cases/void-due/void-due.request';

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
