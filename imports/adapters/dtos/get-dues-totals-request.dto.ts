import { IsArray, IsEnum, IsString } from 'class-validator';

import { DueCategoryEnum, DueStatusEnum } from '@domain/dues/due.enum';
import { FindPaginatedDuesFilters } from '@domain/dues/due.repository';

export class GetDuesTotalsRequestDto implements FindPaginatedDuesFilters {
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
