import { ArrayMinSize, IsArray, IsEnum, IsOptional } from 'class-validator';

import {
  MemberCategoryEnum,
  MemberStatusEnum,
} from '@domain/members/member.enum';
import { FindMembersRequest } from '@domain/members/repositories/member-repository.interface';

export class GetMembersRequestDto implements FindMembersRequest {
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
