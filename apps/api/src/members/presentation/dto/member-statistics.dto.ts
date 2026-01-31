import type {
  MemberDebtorDto,
  MemberStatisticsDto,
} from '@club-social/shared/members';

import { Type } from 'class-transformer';
import { IsNumber, IsOptional, Max, Min } from 'class-validator';

export class MemberStatisticsRequestDto {
  @IsNumber()
  @IsOptional()
  @Max(50)
  @Min(1)
  @Type(() => Number)
  public limit?: number;
}

export class MemberStatisticsResponseDto implements MemberStatisticsDto {
  public byCategory!: MemberStatisticsDto['byCategory'];
  public bySex!: MemberStatisticsDto['bySex'];
  public topDebtors!: MemberDebtorDto[];
  public total!: number;
}
