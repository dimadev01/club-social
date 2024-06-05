import { GetMembersRequest } from '@application/members/use-cases/get-members/get-members.request';
import { ArrayMinSize, IsArray, IsEnum, IsOptional } from 'class-validator';

import {
  MemberCategoryEnum,
  MemberStatusEnum,
} from '@domain/members/member.enum';

export class GetMembersRequestDto implements GetMembersRequest {
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
