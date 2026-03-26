import type { DueCollectionRateDto } from '@club-social/shared/dues';

import { IsArray, IsDateString, IsOptional } from 'class-validator';

export class DueCollectionRateResponseDto implements DueCollectionRateDto {
  public collectedAmount: number;
  public collectionRate: number;
  public paidDues: number;
  public partiallyPaidDues: number;
  public pendingAmount: number;
  public pendingDues: number;
  public totalAmount: number;
  public totalDues: number;
}

export class GetCollectionRateQueryRequestDto {
  @IsArray()
  @IsDateString({}, { each: true })
  @IsOptional()
  public dateRange?: [string, string];
}
