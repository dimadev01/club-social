import { IsInt, IsPositive, IsString } from 'class-validator';

import { IsNullable } from '@adapters/common/class-validator/is-nullable';
import { GetOneByIdRequestDto } from '@adapters/common/dtos/get-one-dto-request.dto';
import { UpdateDueRequest } from '@application/dues/use-cases/update-due/update-due.request';

export class UpdateDueRequestDto
  extends GetOneByIdRequestDto
  implements UpdateDueRequest
{
  @IsInt()
  @IsPositive()
  public amount!: number;

  @IsString()
  @IsNullable()
  public notes!: string | null;
}
