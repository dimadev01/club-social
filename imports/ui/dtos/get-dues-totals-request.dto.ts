import { IsArray, IsEnum, IsString } from 'class-validator';

import { FindPaginatedDuesFilters } from '@application/dues/repositories/due.repository';
import { DueCategoryEnum, DueStatusEnum } from '@domain/dues/due.enum';
import { MemberStatusEnum } from '@domain/members/member.enum';

export class GetDuesTotalsRequestDto implements FindPaginatedDuesFilters {
  @IsEnum(MemberStatusEnum, { each: true })
  @IsArray()
  public filterByMemberStatus!: MemberStatusEnum[];

  @IsEnum(DueCategoryEnum, { each: true })
  @IsArray()
  public filterByCategory!: DueCategoryEnum[];

  @IsString({ each: true })
  @IsArray()
  public filterByCreatedAt!: string[];

  @IsString({ each: true })
  @IsArray()
  public filterByDate!: string[];

  @IsString({ each: true })
  @IsArray()
  public filterByMember!: string[];

  @IsEnum(DueStatusEnum, { each: true })
  @IsArray()
  public filterByStatus!: DueStatusEnum[];
}
