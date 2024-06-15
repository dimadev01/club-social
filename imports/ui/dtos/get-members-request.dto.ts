import { ArrayMinSize, IsArray, IsEnum, IsOptional } from 'class-validator';

import { FindMembers } from '@application/members/repositories/member.repository';
import {
  MemberCategoryEnum,
  MemberStatusEnum,
} from '@domain/members/member.enum';

export class GetMembersRequestDto implements FindMembers {
  @IsEnum(MemberStatusEnum, { each: true })
  @ArrayMinSize(1)
  @IsArray()
  @IsOptional()
  public status?: MemberStatusEnum[];

  @IsEnum(MemberCategoryEnum, { each: true })
  @ArrayMinSize(1)
  @IsArray()
  @IsOptional()
  public category?: MemberCategoryEnum[];
}
