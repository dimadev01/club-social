import type {
  MemberCategory,
  MemberDebtorDto,
  MemberStatisticsDto,
} from '@club-social/shared/members';

import { Type } from 'class-transformer';
import { IsNumber, IsOptional, Max, Min } from 'class-validator';

export class MemberStatisticsBySexDto {
  public female: number;
  public male: number;
  public unknown: number;
}

export class MemberStatisticsRequestDto {
  @IsNumber()
  @IsOptional()
  @Max(50)
  @Min(1)
  @Type(() => Number)
  public limit?: number;
}

export class MemberStatisticsResponseDto implements MemberStatisticsDto {
  public byCategory: Record<MemberCategory, number>;
  public bySex: MemberStatisticsBySexDto;
  public topDebtors: MemberDebtorDto[];
  public total: number;
}
