import { DueCategory } from '../dues/due.enum';
import { MemberCategory } from '../members/member.enum';

export interface CreatePricingDto {
  amount: number;
  dueCategory: DueCategory;
  effectiveFrom: string;
  memberCategory: MemberCategory | null;
}

export interface FindPricingDto {
  dueCategory: DueCategory;
  memberCategory: MemberCategory;
  memberId: string;
}

export interface FoundPricingDto {
  amount: number;
  baseAmount: number;
  discountPercent: number;
  isGroupPricing: boolean;
}

export interface PricingDto {
  amount: number;
  createdAt: string;
  createdBy: string;
  dueCategory: DueCategory;
  effectiveFrom: string;
  effectiveTo: null | string;
  id: string;
  memberCategory: MemberCategory | null;
  updatedAt: string;
  updatedBy?: null | string;
}

export interface PricingPaginatedDto {
  amount: number;
  createdAt: string;
  createdBy: string;
  dueCategory: DueCategory;
  effectiveFrom: string;
  effectiveTo: null | string;
  id: string;
  memberCategory: MemberCategory | null;
}

export interface UpdatePricingDto {
  amount: number;
  effectiveFrom: null | string;
}
