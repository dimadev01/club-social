import {
  MovementCategory,
  MovementMode,
  MovementStatus,
} from '@club-social/shared/movements';

import { MovementEntity } from '@/movements/domain/entities/movement.entity';
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

export interface MovementPropsOverrides {
  amount?: SignedAmount;
  category?: MovementCategory;
  date?: DateOnly;
  mode?: MovementMode;
  notes?: null | string;
  paymentId?: null | UniqueId;
  status?: MovementStatus;
}

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
