import { IsEnum, IsOptional, IsString } from 'class-validator';

import { MemberStatusEnum } from '@domain/members/member.enum';
import { CreateMemberRequestDto } from '@domain/members/use-cases/create-member/create-member-request.dto';

export class UpdateMemberRequestDto extends CreateMemberRequestDto {
  @IsString()
  @IsOptional()
  id: string;

  @IsEnum(MemberStatusEnum)
  status: MemberStatusEnum;
}
