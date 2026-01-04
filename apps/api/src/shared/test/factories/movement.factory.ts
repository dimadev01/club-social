import {
  MovementCategory,
  MovementMode,
  MovementStatus,
} from '@club-social/shared/movements';

import {
  MovementEntity,
  type MovementProps,
} from '@/movements/domain/entities/movement.entity';
import { SignedAmount } from '@/shared/domain/value-objects/amount/signed-amount.vo';
import { DateOnly } from '@/shared/domain/value-objects/date-only/date-only.vo';

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

export const createInflowMovementProps = (
  overrides?: MovementPropsOverrides,
) => ({
  amount: SignedAmount.fromCents(
    TEST_MOVEMENT_INFLOW_AMOUNT_CENTS,
  )._unsafeUnwrap(),
  category: MovementCategory.MEMBER_LEDGER,
  date: DateOnly.fromString(TEST_MOVEMENT_DATE)._unsafeUnwrap(),
  mode: MovementMode.MANUAL,
  notes: TEST_MOVEMENT_INFLOW_NOTES,
  paymentId: null,
  status: MovementStatus.REGISTERED,
  ...overrides,
});

export const createOutflowMovementProps = (
  overrides?: MovementPropsOverrides,
) => ({
  amount: SignedAmount.fromCents(
    TEST_MOVEMENT_OUTFLOW_AMOUNT_CENTS,
  )._unsafeUnwrap(),
  category: MovementCategory.EXPENSE,
  date: DateOnly.fromString(TEST_MOVEMENT_DATE)._unsafeUnwrap(),
  mode: MovementMode.MANUAL,
  notes: TEST_MOVEMENT_OUTFLOW_NOTES,
  paymentId: null,
  status: MovementStatus.REGISTERED,
  ...overrides,
});

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
