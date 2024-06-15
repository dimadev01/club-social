import { IsArray, IsEnum, IsString } from 'class-validator';

import { FindPaginatedMembersRequest } from '@application/members/repositories/member.repository';
import {
  MemberCategoryEnum,
  MemberStatusEnum,
} from '@domain/members/member.enum';
import { GetGridRequestDto } from '@ui/common/dtos/get-grid-request.dto';

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
