import { IsArray, IsEnum } from 'class-validator';

import { FindPaginatedPricesRequest } from '@application/prices/repositories/price.repository';
import { DueCategoryEnum } from '@domain/dues/due.enum';
import { MemberCategoryEnum } from '@domain/members/member.enum';
import { GetGridRequestDto } from '@ui/common/dtos/get-grid-request.dto';

export class GetPricesGridRequestDto
  extends GetGridRequestDto
  implements FindPaginatedPricesRequest
{
  @IsEnum(DueCategoryEnum, { each: true })
  @IsArray()
  public filterByDueCategory!: DueCategoryEnum[];

  @IsEnum(MemberCategoryEnum, { each: true })
  @IsArray()
  public filterByMemberCategory!: MemberCategoryEnum[];
}
