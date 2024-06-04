import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';

import { GetGridRequestDto } from '@adapters/common/dtos/get-grid-request.dto';
import { GetMembersGridRequest } from '@application/members/use-cases/ger-members-grid/get-members-grid.request';
import {
  MemberCategoryEnum,
  MemberStatusEnum,
} from '@domain/members/member.enum';

export class GetMembersGridRequestDto
  extends GetGridRequestDto
  implements GetMembersGridRequest
{
  @IsEnum(MemberCategoryEnum, { each: true })
  @ArrayMinSize(1)
  @IsArray()
  @IsOptional()
  public filterByCategory!: MemberCategoryEnum[];

  @IsString({ each: true })
  @ArrayMinSize(1)
  @IsArray()
  @IsOptional()
  public filterByDebtStatus!: string[];

  @IsString({ each: true })
  @ArrayMinSize(1)
  @IsArray()
  @IsOptional()
  public filterById!: string[];

  @IsEnum(MemberStatusEnum, { each: true })
  @ArrayMinSize(1)
  @IsArray()
  @IsOptional()
  public filterByStatus!: MemberStatusEnum[];
}
