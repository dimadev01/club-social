import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

import { MemberStatusEnum } from '@domain/members/member.enum';
import { UpdateMemberRequest } from '@domain/members/use-cases/update-member-new/update-member.request';
import { CreateMemberRequestDto } from '@infra/controllers/member/create-member-request.dto';

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
