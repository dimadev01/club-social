import type { MemberCategory } from './member.enum';

export interface MemberDebtorDto {
  category: MemberCategory;
  id: string;
  name: string;
  totalDebt: number;
}

export interface MemberStatisticsBySexDto {
  female: number;
  male: number;
  unknown: number;
}

export interface MemberStatisticsDto {
  byCategory: Record<MemberCategory, number>;
  bySex: MemberStatisticsBySexDto;
  topDebtors: MemberDebtorDto[];
  total: number;
}
