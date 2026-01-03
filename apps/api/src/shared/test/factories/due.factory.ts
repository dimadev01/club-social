import { DueCategory } from '@club-social/shared/dues';

import type { DueProps } from '@/dues/domain/entities/due.entity';

import { DueEntity } from '@/dues/domain/entities/due.entity';
import { Amount } from '@/shared/domain/value-objects/amount/amount.vo';
import { DateOnly } from '@/shared/domain/value-objects/date-only/date-only.vo';
import { UniqueId } from '@/shared/domain/value-objects/unique-id/unique-id.vo';

import {
  TEST_CREATED_BY,
  TEST_DUE_AMOUNT_CENTS,
  TEST_DUE_DATE,
  TEST_DUE_NOTES,
} from '../constants';

export type DuePropsOverrides = Partial<DueProps>;

export const createDueProps = (
  memberId: UniqueId,
  overrides?: DuePropsOverrides,
) => ({
  amount: Amount.fromCents(TEST_DUE_AMOUNT_CENTS)._unsafeUnwrap(),
  category: DueCategory.MEMBERSHIP,
  date: DateOnly.fromString(TEST_DUE_DATE)._unsafeUnwrap(),
  memberId,
  notes: TEST_DUE_NOTES,
  ...overrides,
});

export const createTestDue = (
  memberId: UniqueId,
  overrides?: DuePropsOverrides,
): DueEntity =>
  DueEntity.create(
    createDueProps(memberId, overrides),
    TEST_CREATED_BY,
  )._unsafeUnwrap();
