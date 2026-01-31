import type { MemberCategory } from './member.enum';

export interface MemberDebtorDto {
  category: MemberCategory;
  id: string;
  name: string;
  totalDebt: number;
}

export interface MemberStatisticsDto {
  byCategory: Record<MemberCategory, number>;
  bySex: {
    female: number;
    male: number;
    unknown: number;
  };
  topDebtors: MemberDebtorDto[];
  total: number;
}
