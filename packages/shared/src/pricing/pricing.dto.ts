import { DueCategory } from '../dues/due.enum';
import { MemberCategory } from '../members/member.enum';

export interface ICreatePricingDto {
  amount: number;
  dueCategory: DueCategory;
  effectiveFrom: string;
  memberCategory: MemberCategory;
}

export interface IFindActivePricingDto {
  date: string;
  dueCategory: DueCategory;
  memberCategory: MemberCategory;
}

export interface IPricingDetailDto {
  amount: number;
  createdAt: string;
  createdBy: string;
  dueCategory: DueCategory;
  effectiveFrom: string;
  effectiveTo: null | string;
  id: string;
  memberCategory: MemberCategory;
  updatedAt: string;
  updatedBy: string;
}

export interface IUpdatePricingDto {
  amount: number;
  effectiveTo: null | string;
}
