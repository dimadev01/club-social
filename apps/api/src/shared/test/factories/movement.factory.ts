import {
  MovementCategory,
  MovementMode,
  MovementStatus,
} from '@club-social/shared/movements';

import {
  MovementEntity,
  type MovementProps,
} from '@/movements/domain/entities/movement.entity';
import { PersistenceMeta } from '@/shared/domain/persistence-meta';
import { SignedAmount } from '@/shared/domain/value-objects/amount/signed-amount.vo';
import { DateOnly } from '@/shared/domain/value-objects/date-only/date-only.vo';
import { UniqueId } from '@/shared/domain/value-objects/unique-id/unique-id.vo';

import {
  TEST_CREATED_BY,
  TEST_MOVEMENT_DATE,
  TEST_MOVEMENT_INFLOW_AMOUNT_CENTS,
  TEST_MOVEMENT_INFLOW_NOTES,
  TEST_MOVEMENT_OUTFLOW_AMOUNT_CENTS,
  TEST_MOVEMENT_OUTFLOW_NOTES,
} from '../constants';

export type MovementPropsOverrides = Partial<
  Omit<MovementProps, 'voidedAt' | 'voidedBy' | 'voidReason'>
>;

export type PersistedMovementPropsOverrides = Partial<MovementProps>;

const createBaseMovementProps = (
  amountCents: number,
  category: MovementCategory,
  notes: string,
  overrides?: MovementPropsOverrides,
) => ({
  amount: SignedAmount.fromCents(amountCents)._unsafeUnwrap(),
  category,
  date: DateOnly.fromString(TEST_MOVEMENT_DATE)._unsafeUnwrap(),
  mode: MovementMode.MANUAL,
  notes,
  paymentId: null,
  status: MovementStatus.REGISTERED,
  ...overrides,
});

export const createInflowMovementProps = (overrides?: MovementPropsOverrides) =>
  createBaseMovementProps(
    TEST_MOVEMENT_INFLOW_AMOUNT_CENTS,
    MovementCategory.MEMBER_LEDGER,
    TEST_MOVEMENT_INFLOW_NOTES,
    overrides,
  );

const createOutflowMovementProps = (overrides?: MovementPropsOverrides) =>
  createBaseMovementProps(
    TEST_MOVEMENT_OUTFLOW_AMOUNT_CENTS,
    MovementCategory.EXPENSE,
    TEST_MOVEMENT_OUTFLOW_NOTES,
    overrides,
  );

export const createTestInflowMovement = (
  overrides?: MovementPropsOverrides,
): MovementEntity =>
  MovementEntity.create(
    createInflowMovementProps(overrides),
    TEST_CREATED_BY,
  )._unsafeUnwrap();

export const createTestOutflowMovement = (
  overrides?: MovementPropsOverrides,
): MovementEntity =>
  MovementEntity.create(
    createOutflowMovementProps(overrides),
    TEST_CREATED_BY,
  )._unsafeUnwrap();

const createPersistedMovementProps = (
  overrides?: PersistedMovementPropsOverrides,
): MovementProps => ({
  amount: SignedAmount.fromCents(
    TEST_MOVEMENT_INFLOW_AMOUNT_CENTS,
  )._unsafeUnwrap(),
  category: MovementCategory.MEMBER_LEDGER,
  date: DateOnly.fromString(TEST_MOVEMENT_DATE)._unsafeUnwrap(),
  mode: MovementMode.MANUAL,
  notes: TEST_MOVEMENT_INFLOW_NOTES,
  paymentId: null,
  status: MovementStatus.REGISTERED,
  voidedAt: null,
  voidedBy: null,
  voidReason: null,
  ...overrides,
});

export const createTestMovementFromPersistence = (
  propsOverrides?: PersistedMovementPropsOverrides,
  metaOverrides?: Partial<PersistenceMeta>,
): MovementEntity =>
  MovementEntity.fromPersistence(createPersistedMovementProps(propsOverrides), {
    audit: { createdBy: TEST_CREATED_BY },
    id: UniqueId.generate(),
    ...metaOverrides,
  });
