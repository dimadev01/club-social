import type { DueAgingBracketDto, DueAgingDto } from '@club-social/shared/dues';

export class DueAgingBracketResponseDto implements DueAgingBracketDto {
  public amount: number;
  public count: number;
  public label: string;
  public maxDays: null | number;
  public minDays: number;
  public percentage: number;
}

export class DueAgingResponseDto implements DueAgingDto {
  public brackets: DueAgingBracketResponseDto[];
  public total: number;
}
