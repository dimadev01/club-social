import { IsEnum, IsOptional, IsString } from 'class-validator';
import { MemberStatus } from '@domain/members/members.enum';
import { CreateMemberRequestDto } from '@domain/members/use-cases/create-member/create-member-request.dto';

export class UpdateMemberRequestDto extends CreateMemberRequestDto {
  @IsString()
  @IsOptional()
  id: string;

  @IsEnum(MemberStatus)
  status: MemberStatus;
}
