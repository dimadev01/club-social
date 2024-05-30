import { ArrayMinSize, IsArray, IsDefined, IsEnum } from 'class-validator';

import { FindMembersRequest } from '@domain/members/member-repository.interface';
import {
  MemberCategoryEnum,
  MemberStatusEnum,
} from '@domain/members/member.enum';
import { IsNullable } from '@shared/class-validator/is-nullable';

export class GetMembersRequestDto implements FindMembersRequest {
  @IsEnum(MemberStatusEnum, { each: true })
  @ArrayMinSize(1)
  @IsArray()
  @IsNullable()
  @IsDefined()
  public status!: MemberStatusEnum[] | null;

  @IsEnum(MemberCategoryEnum, { each: true })
  @ArrayMinSize(1)
  @IsArray()
  @IsNullable()
  @IsDefined()
  public category!: MemberCategoryEnum[] | null;
}
