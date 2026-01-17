import { DueCategory, DueStatus } from '@club-social/shared/dues';

import type {
  CreateDueProps,
  DueProps,
} from '@/dues/domain/entities/due.entity';

import { DueEntity } from '@/dues/domain/entities/due.entity';
import { PersistenceMeta } from '@/shared/domain/persistence-meta';
import { Amount } from '@/shared/domain/value-objects/amount/amount.vo';
import { DateOnly } from '@/shared/domain/value-objects/date-only/date-only.vo';
import { UniqueId } from '@/shared/domain/value-objects/unique-id/unique-id.vo';

import {
  TEST_CREATED_BY,
  TEST_DUE_AMOUNT_CENTS,
  TEST_DUE_DATE,
  TEST_DUE_NOTES,
} from '../constants';

export const createDueProps = (overrides?: Partial<CreateDueProps>) => ({
  amount: Amount.fromCents(TEST_DUE_AMOUNT_CENTS)._unsafeUnwrap(),
  category: DueCategory.MEMBERSHIP,
  date: DateOnly.fromString(TEST_DUE_DATE)._unsafeUnwrap(),
  memberId: UniqueId.generate(),
  notes: TEST_DUE_NOTES,
  ...overrides,
});

export const createTestDue = (overrides?: Partial<CreateDueProps>): DueEntity =>
  DueEntity.create(createDueProps(overrides), TEST_CREATED_BY)._unsafeUnwrap();

const createPersistedDueProps = (overrides?: Partial<DueProps>): DueProps => ({
  amount: Amount.fromCents(TEST_DUE_AMOUNT_CENTS)._unsafeUnwrap(),
  category: DueCategory.MEMBERSHIP,
  date: DateOnly.fromString(TEST_DUE_DATE)._unsafeUnwrap(),
  memberId: UniqueId.generate(),
  notes: TEST_DUE_NOTES,
  settlements: [],
  status: DueStatus.PENDING,
  voidedAt: null,
  voidedBy: null,
  voidReason: null,
  ...overrides,
});

export const createTestDueFromPersistence = (
  propsOverrides?: Partial<DueProps>,
  metaOverrides?: Partial<PersistenceMeta>,
): DueEntity =>
  DueEntity.fromPersistence(createPersistedDueProps(propsOverrides), {
    audit: { createdBy: TEST_CREATED_BY },
    id: UniqueId.generate(),
    ...metaOverrides,
  });
