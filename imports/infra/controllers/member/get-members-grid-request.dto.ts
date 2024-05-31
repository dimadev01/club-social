import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';

import {
  MemberCategoryEnum,
  MemberStatusEnum,
} from '@domain/members/member.enum';
import { FindPaginatedMembersRequest } from '@domain/members/repositories/find-paginated-members.interface';
import { GetGridRequestDto } from '@infra/controllers/types/get-grid-request.dto';

export class GetMembersGridRequestDto
  extends GetGridRequestDto
  implements FindPaginatedMembersRequest
{
  @IsEnum(MemberCategoryEnum, { each: true })
  @ArrayMinSize(1)
  @IsArray()
  @IsOptional()
  public filterByCategory?: MemberCategoryEnum[];

  @IsString({ each: true })
  @ArrayMinSize(1)
  @IsArray()
  @IsOptional()
  public filterByDebtStatus?: string[];

  @IsString({ each: true })
  @ArrayMinSize(1)
  @IsArray()
  @IsOptional()
  public filterById?: string[];

  @IsEnum(MemberStatusEnum, { each: true })
  @ArrayMinSize(1)
  @IsArray()
  @IsOptional()
  public filterByStatus?: MemberStatusEnum[];
}
