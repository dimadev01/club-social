import {
  ArrayMinSize,
  IsArray,
  IsDefined,
  IsEnum,
  IsString,
} from 'class-validator';

import { GetMembersGridRequest } from '@domain/members/member-repository.interface';
import {
  MemberCategoryEnum,
  MemberStatusEnum,
} from '@domain/members/member.enum';
import { GetGridRequestDto } from '@infra/controllers/types/get-grid-request.dto';
import { IsNullable } from '@shared/class-validator/is-nullable';

export class GetMembersGridRequestDto
  extends GetGridRequestDto
  implements GetMembersGridRequest
{
  @IsEnum(MemberCategoryEnum, { each: true })
  @ArrayMinSize(1)
  @IsArray()
  @IsNullable()
  @IsDefined()
  public filterByCategory!: MemberCategoryEnum[] | null;

  @IsString({ each: true })
  @ArrayMinSize(1)
  @IsArray()
  @IsNullable()
  @IsDefined()
  public filterByDebtStatus!: string[] | null;

  @IsString({ each: true })
  @ArrayMinSize(1)
  @IsArray()
  @IsNullable()
  @IsDefined()
  public filterById!: string[] | null;

  @IsEnum(MemberStatusEnum, { each: true })
  @ArrayMinSize(1)
  @IsArray()
  @IsNullable()
  @IsDefined()
  public filterByStatus!: MemberStatusEnum[] | null;
}
