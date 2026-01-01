import { PaymentEntity } from '@/payments/domain/entities/payment.entity';
import { Amount } from '@/shared/domain/value-objects/amount/amount.vo';
import { DateOnly } from '@/shared/domain/value-objects/date-only/date-only.vo';
import { UniqueId } from '@/shared/domain/value-objects/unique-id/unique-id.vo';

import {
  TEST_CREATED_BY,
  TEST_PAYMENT_AMOUNT_CENTS,
  TEST_PAYMENT_DATE,
  TEST_PAYMENT_NOTES,
  TEST_PAYMENT_RECEIPT_NUMBER,
} from '../constants';

export interface PaymentPropsOverrides {
  amount?: Amount;
  date?: DateOnly;
  dueIds?: UniqueId[];
  memberId?: UniqueId;
  notes?: null | string;
  receiptNumber?: null | string;
}

export const createPaymentProps = (overrides?: PaymentPropsOverrides) => ({
  amount: Amount.fromCents(TEST_PAYMENT_AMOUNT_CENTS)._unsafeUnwrap(),
  date: DateOnly.fromString(TEST_PAYMENT_DATE)._unsafeUnwrap(),
  dueIds: [UniqueId.generate()],
  memberId: UniqueId.generate(),
  notes: TEST_PAYMENT_NOTES,
  receiptNumber: TEST_PAYMENT_RECEIPT_NUMBER,
  ...overrides,
});

export const createTestPayment = (
  overrides?: PaymentPropsOverrides,
): PaymentEntity =>
  PaymentEntity.create(
    createPaymentProps(overrides),
    TEST_CREATED_BY,
  )._unsafeUnwrap();
