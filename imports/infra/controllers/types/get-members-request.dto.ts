import { ArrayMinSize, IsArray, IsDefined, IsEnum } from 'class-validator';

import { MemberStatusEnum } from '@domain/members/member.enum';
import { GetMembersRequest } from '@domain/members/use-cases/get-members/get-members-request';
import { IsNullable } from '@shared/class-validator/is-nullable';

export class GetMembersRequestDto implements GetMembersRequest {
  @IsEnum(MemberStatusEnum, { each: true })
  @ArrayMinSize(1)
  @IsArray()
  @IsNullable()
  @IsDefined()
  public status!: MemberStatusEnum[] | null;
}
