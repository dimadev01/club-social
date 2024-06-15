import { IsInt, IsPositive, IsString } from 'class-validator';

import { UpdateDueRequest } from '@application/dues/use-cases/update-due/update-due.request';
import { IsNullable } from '@ui/common/class-validator/is-nullable';
import { GetOneByIdRequestDto } from '@ui/common/dtos/get-one-dto-request.dto';

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
