import { IsArray, IsEnum, IsString } from 'class-validator';

import { GetGridRequestDto } from '@adapters/common/dtos/get-grid-request.dto';
import {
  MemberCategoryEnum,
  MemberStatusEnum,
} from '@domain/members/member.enum';
import { FindPaginatedMembersRequest } from '@domain/members/member.repository';

export class GetMembersGridRequestDto
  extends GetGridRequestDto
  implements FindPaginatedMembersRequest
{
  @IsEnum(MemberCategoryEnum, { each: true })
  @IsArray()
  public filterByCategory!: MemberCategoryEnum[];

  @IsString({ each: true })
  @IsArray()
  public filterByDebtStatus!: string[];

  @IsString({ each: true })
  @IsArray()
  public filterById!: string[];

  @IsEnum(MemberStatusEnum, { each: true })
  @IsArray()
  public filterByStatus!: MemberStatusEnum[];
}
