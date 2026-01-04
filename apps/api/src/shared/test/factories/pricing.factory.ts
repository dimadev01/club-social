import { DueCategory } from '@club-social/shared/dues';
import { MemberCategory } from '@club-social/shared/members';

import {
  PricingEntity,
  type PricingProps,
} from '@/pricing/domain/entities/pricing.entity';
import { Amount } from '@/shared/domain/value-objects/amount/amount.vo';
import { DateOnly } from '@/shared/domain/value-objects/date-only/date-only.vo';

import {
  TEST_CREATED_BY,
  TEST_PRICING_AMOUNT_CENTS,
  TEST_PRICING_EFFECTIVE_FROM,
} from '../constants';

export type PricingPropsOverrides = Partial<Omit<PricingProps, 'effectiveTo'>>;

export const createPricingProps = (overrides?: PricingPropsOverrides) => ({
  amount: Amount.fromCents(TEST_PRICING_AMOUNT_CENTS)._unsafeUnwrap(),
  dueCategory: DueCategory.MEMBERSHIP,
  effectiveFrom: DateOnly.fromString(
    TEST_PRICING_EFFECTIVE_FROM,
  )._unsafeUnwrap(),
  memberCategory: MemberCategory.MEMBER,
  ...overrides,
});

export const createTestPricing = (
  overrides?: PricingPropsOverrides,
): PricingEntity =>
  PricingEntity.create(
    createPricingProps(overrides),
    TEST_CREATED_BY,
  )._unsafeUnwrap();
