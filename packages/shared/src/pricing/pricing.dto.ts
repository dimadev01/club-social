import { DueCategory } from '../dues/due.enum';
import { MemberCategory } from '../members/member.enum';

export interface CreatePricingDto {
  amount: number;
  dueCategory: DueCategory;
  effectiveFrom: string;
  memberCategory: MemberCategory;
}

export interface IFindActivePricingDto {
  dueCategory: DueCategory;
  memberCategory: MemberCategory;
}

export interface IPricingPaginatedDto {
  amount: number;
  createdAt: string;
  createdBy: string;
  dueCategory: DueCategory;
  effectiveFrom: string;
  effectiveTo: null | string;
  id: string;
  memberCategory: MemberCategory;
}

export interface PricingDto {
  amount: number;
  createdAt: string;
  createdBy: string;
  dueCategory: DueCategory;
  effectiveFrom: string;
  effectiveTo: null | string;
  id: string;
  memberCategory: MemberCategory;
  updatedAt: string;
  updatedBy?: null | string;
}

export interface UpdatePricingDto {
  amount: number;
  effectiveFrom: null | string;
}
