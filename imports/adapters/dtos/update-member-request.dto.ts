import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

import { CreateMemberRequestDto } from '@adapters/dtos/create-member-request.dto';
import { UpdateMemberRequest } from '@application/members/use-cases/update-member/update-member.request';
import { MemberStatusEnum } from '@domain/members/member.enum';

export class UpdateMemberRequestDto
  extends CreateMemberRequestDto
  implements UpdateMemberRequest
{
  @IsNotEmpty()
  @IsString()
  public id!: string;

  @IsEnum(MemberStatusEnum)
  public status!: MemberStatusEnum;
}
