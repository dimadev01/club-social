import { PaymentStatus } from '@club-social/shared/payments';

import { Amount } from '@/shared/domain/value-objects/amount/amount.vo';
import { DateOnly } from '@/shared/domain/value-objects/date-only/date-only.vo';
import { UniqueId } from '@/shared/domain/value-objects/unique-id/unique-id.vo';
import {
  TEST_ALT_PAYMENT_AMOUNT_CENTS,
  TEST_ALT_PAYMENT_DATE,
  TEST_ALT_PAYMENT_NOTES,
  TEST_ALT_PAYMENT_RECEIPT_NUMBER,
  TEST_CREATED_BY,
  TEST_PAYMENT_AMOUNT_CENTS,
  TEST_PAYMENT_DATE,
  TEST_PAYMENT_NOTES,
  TEST_PAYMENT_RECEIPT_NUMBER,
} from '@/shared/test/constants';
import {
  createPaymentProps,
  createTestPayment,
  createTestPaymentFromPersistence,
} from '@/shared/test/factories';

import { PaymentCreatedEvent } from '../events/payment-created.event';
import { PaymentUpdatedEvent } from '../events/payment-updated.event';
import { PaymentEntity } from './payment.entity';

describe('PaymentEntity', () => {
  describe('create', () => {
    it('should create a payment with valid props', () => {
      const props = createPaymentProps();

      const result = PaymentEntity.create(props, TEST_CREATED_BY);

      expect(result.isOk()).toBe(true);
      const payment = result._unsafeUnwrap();
      expect(payment.amount.cents).toBe(TEST_PAYMENT_AMOUNT_CENTS);
      expect(payment.date.value).toBe(TEST_PAYMENT_DATE);
      expect(payment.dueIds).toHaveLength(1);
      expect(payment.memberId).toBe(props.memberId);
      expect(payment.notes).toBe(TEST_PAYMENT_NOTES);
      expect(payment.receiptNumber).toBe(TEST_PAYMENT_RECEIPT_NUMBER);
      expect(payment.status).toBe(PaymentStatus.PAID);
      expect(payment.voidedAt).toBeNull();
      expect(payment.voidedBy).toBeNull();
      expect(payment.voidReason).toBeNull();
      expect(payment.createdBy).toBe(TEST_CREATED_BY);
    });

    it('should create a payment with null notes and receiptNumber', () => {
      const payment = createTestPayment({
        notes: null,
        receiptNumber: null,
      });

      expect(payment.notes).toBeNull();
      expect(payment.receiptNumber).toBeNull();
    });

    it('should generate a unique id', () => {
      const payment1 = createTestPayment();
      const payment2 = createTestPayment();

      expect(payment1.id.value).not.toBe(payment2.id.value);
    });

    it('should add PaymentCreatedEvent on creation', () => {
      const payment = createTestPayment();
      const events = payment.pullEvents();

      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(PaymentCreatedEvent);
      expect((events[0] as PaymentCreatedEvent).payment).toBe(payment);
    });
  });

  describe('fromPersistence', () => {
    it('should create a payment from persisted data', () => {
      const id = UniqueId.generate();
      const memberId = UniqueId.generate();
      const dueIds = [UniqueId.generate()];

      const payment = createTestPaymentFromPersistence(
        {
          amount: Amount.fromCents(
            TEST_ALT_PAYMENT_AMOUNT_CENTS,
          )._unsafeUnwrap(),
          date: DateOnly.fromString(TEST_ALT_PAYMENT_DATE)._unsafeUnwrap(),
          dueIds,
          memberId,
          notes: TEST_ALT_PAYMENT_NOTES,
          receiptNumber: TEST_ALT_PAYMENT_RECEIPT_NUMBER,
        },
        {
          audit: {
            createdAt: new Date(TEST_ALT_PAYMENT_DATE),
            createdBy: TEST_CREATED_BY,
            updatedAt: null,
            updatedBy: null,
          },
          id,
        },
      );

      expect(payment.id).toBe(id);
      expect(payment.amount.cents).toBe(TEST_ALT_PAYMENT_AMOUNT_CENTS);
      expect(payment.status).toBe(PaymentStatus.PAID);
      expect(payment.createdBy).toBe(TEST_CREATED_BY);
    });

    it('should create a voided payment from persisted data', () => {
      const voidedAt = new Date('2024-03-01');

      const payment = createTestPaymentFromPersistence({
        status: PaymentStatus.VOIDED,
        voidedAt,
        voidedBy: TEST_CREATED_BY,
        voidReason: 'Duplicate payment',
      });

      expect(payment.status).toBe(PaymentStatus.VOIDED);
      expect(payment.voidedAt).toBe(voidedAt);
      expect(payment.voidedBy).toBe(TEST_CREATED_BY);
      expect(payment.voidReason).toBe('Duplicate payment');
    });
  });

  describe('clone', () => {
    it('should create an exact copy of the payment', () => {
      const original = createTestPayment();

      const cloned = original.clone();

      expect(cloned.id.value).toBe(original.id.value);
      expect(cloned.amount.cents).toBe(original.amount.cents);
      expect(cloned.date.value).toBe(original.date.value);
      expect(cloned.memberId.value).toBe(original.memberId.value);
      expect(cloned.notes).toBe(original.notes);
      expect(cloned.receiptNumber).toBe(original.receiptNumber);
      expect(cloned.status).toBe(original.status);
    });

    it('should create an independent copy', () => {
      const original = createTestPayment();
      original.pullEvents();
      const cloned = original.clone();

      original.void({ voidedBy: TEST_CREATED_BY, voidReason: 'Test void' });

      expect(original.isVoided()).toBe(true);
      expect(cloned.isVoided()).toBe(false);
    });
  });

  describe('isPaid', () => {
    it('should return true when status is PAID', () => {
      const payment = createTestPayment();

      expect(payment.isPaid()).toBe(true);
    });

    it('should return false when status is VOIDED', () => {
      const payment = createTestPaymentFromPersistence({
        status: PaymentStatus.VOIDED,
        voidedAt: new Date(),
        voidedBy: TEST_CREATED_BY,
        voidReason: 'Test',
      });

      expect(payment.isPaid()).toBe(false);
    });
  });

  describe('isVoided', () => {
    it('should return true when status is VOIDED', () => {
      const payment = createTestPaymentFromPersistence({
        status: PaymentStatus.VOIDED,
        voidedAt: new Date(),
        voidedBy: TEST_CREATED_BY,
        voidReason: 'Test',
      });

      expect(payment.isVoided()).toBe(true);
    });

    it('should return false when status is PAID', () => {
      const payment = createTestPayment();

      expect(payment.isVoided()).toBe(false);
    });
  });

  describe('void', () => {
    it('should void a paid payment', () => {
      const payment = createTestPayment();
      payment.pullEvents();

      const result = payment.void({
        voidedBy: TEST_CREATED_BY,
        voidReason: 'Customer request',
      });

      expect(result.isOk()).toBe(true);
      expect(payment.status).toBe(PaymentStatus.VOIDED);
      expect(payment.voidedBy).toBe(TEST_CREATED_BY);
      expect(payment.voidReason).toBe('Customer request');
      expect(payment.voidedAt).toBeInstanceOf(Date);
      expect(payment.updatedBy).toBe(TEST_CREATED_BY);
    });

    it('should add PaymentUpdatedEvent when voiding', () => {
      const payment = createTestPayment();
      payment.pullEvents();

      payment.void({ voidedBy: TEST_CREATED_BY, voidReason: 'Test' });

      const events = payment.pullEvents();
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(PaymentUpdatedEvent);

      const event = events[0] as PaymentUpdatedEvent;
      expect(event.oldPayment.status).toBe(PaymentStatus.PAID);
      expect(event.payment.status).toBe(PaymentStatus.VOIDED);
    });

    it('should fail to void an already voided payment', () => {
      const payment = createTestPaymentFromPersistence({
        status: PaymentStatus.VOIDED,
        voidedAt: new Date(),
        voidedBy: TEST_CREATED_BY,
        voidReason: 'Already voided',
      });

      const result = payment.void({
        voidedBy: TEST_CREATED_BY,
        voidReason: 'Try again',
      });

      expect(result.isErr()).toBe(true);
      expect(result._unsafeUnwrapErr().message).toBe(
        'No se puede anular un pago anulado',
      );
    });
  });

  describe('entity equality', () => {
    it('should be equal when ids match', () => {
      const id = UniqueId.generate();

      const payment1 = createTestPaymentFromPersistence(
        { status: PaymentStatus.PAID },
        { id },
      );

      const payment2 = createTestPaymentFromPersistence(
        {
          amount: Amount.fromCents(2000)._unsafeUnwrap(),
          notes: 'Different',
          status: PaymentStatus.PAID,
        },
        { id },
      );

      expect(payment1.equals(payment2)).toBe(true);
    });

    it('should not be equal when ids differ', () => {
      const payment1 = createTestPayment();
      const payment2 = createTestPayment();

      expect(payment1.equals(payment2)).toBe(false);
    });
  });
});
