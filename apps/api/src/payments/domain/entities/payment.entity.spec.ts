import { PaymentStatus } from '@club-social/shared/payments';

import { Amount } from '@/shared/domain/value-objects/amount/amount.vo';
import { DateOnly } from '@/shared/domain/value-objects/date-only/date-only.vo';
import { UniqueId } from '@/shared/domain/value-objects/unique-id/unique-id.vo';

import { PaymentCreatedEvent } from '../events/payment-created.event';
import { PaymentUpdatedEvent } from '../events/payment-updated.event';
import { PaymentEntity } from './payment.entity';

describe('PaymentEntity', () => {
  const createValidPaymentProps = () => ({
    amount: Amount.fromCents(10000)._unsafeUnwrap(),
    date: DateOnly.fromString('2024-01-15')._unsafeUnwrap(),
    dueIds: [UniqueId.generate()],
    memberId: UniqueId.generate(),
    notes: 'Test payment',
    receiptNumber: 'REC-001',
  });

  describe('create', () => {
    it('should create a payment with valid props', () => {
      const props = createValidPaymentProps();
      const createdBy = 'user-123';

      const result = PaymentEntity.create(props, createdBy);

      expect(result.isOk()).toBe(true);
      const payment = result._unsafeUnwrap();
      expect(payment.amount.cents).toBe(10000);
      expect(payment.date.value).toBe('2024-01-15');
      expect(payment.dueIds).toHaveLength(1);
      expect(payment.memberId).toBe(props.memberId);
      expect(payment.notes).toBe('Test payment');
      expect(payment.receiptNumber).toBe('REC-001');
      expect(payment.status).toBe(PaymentStatus.PAID);
      expect(payment.voidedAt).toBeNull();
      expect(payment.voidedBy).toBeNull();
      expect(payment.voidReason).toBeNull();
      expect(payment.createdBy).toBe(createdBy);
    });

    it('should create a payment with null notes and receiptNumber', () => {
      const props = {
        ...createValidPaymentProps(),
        notes: null,
        receiptNumber: null,
      };

      const result = PaymentEntity.create(props, 'user-123');

      expect(result.isOk()).toBe(true);
      const payment = result._unsafeUnwrap();
      expect(payment.notes).toBeNull();
      expect(payment.receiptNumber).toBeNull();
    });

    it('should generate a unique id', () => {
      const props = createValidPaymentProps();

      const result1 = PaymentEntity.create(props, 'user-123');
      const result2 = PaymentEntity.create(props, 'user-123');

      expect(result1._unsafeUnwrap().id.value).not.toBe(
        result2._unsafeUnwrap().id.value,
      );
    });

    it('should add PaymentCreatedEvent on creation', () => {
      const props = createValidPaymentProps();

      const result = PaymentEntity.create(props, 'user-123');
      const payment = result._unsafeUnwrap();
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

      const payment = PaymentEntity.fromPersistence(
        {
          amount: Amount.fromCents(5000)._unsafeUnwrap(),
          date: DateOnly.fromString('2024-02-20')._unsafeUnwrap(),
          dueIds,
          memberId,
          notes: 'Persisted payment',
          receiptNumber: 'REC-002',
          status: PaymentStatus.PAID,
          voidedAt: null,
          voidedBy: null,
          voidReason: null,
        },
        {
          audit: {
            createdAt: new Date('2024-02-20'),
            createdBy: 'admin',
            updatedAt: null,
            updatedBy: null,
          },
          id,
        },
      );

      expect(payment.id).toBe(id);
      expect(payment.amount.cents).toBe(5000);
      expect(payment.status).toBe(PaymentStatus.PAID);
      expect(payment.createdBy).toBe('admin');
    });

    it('should create a voided payment from persisted data', () => {
      const voidedAt = new Date('2024-03-01');

      const payment = PaymentEntity.fromPersistence(
        {
          amount: Amount.fromCents(5000)._unsafeUnwrap(),
          date: DateOnly.fromString('2024-02-20')._unsafeUnwrap(),
          dueIds: [],
          memberId: UniqueId.generate(),
          notes: null,
          receiptNumber: null,
          status: PaymentStatus.VOIDED,
          voidedAt,
          voidedBy: 'admin',
          voidReason: 'Duplicate payment',
        },
        {
          audit: { createdBy: 'user' },
          id: UniqueId.generate(),
        },
      );

      expect(payment.status).toBe(PaymentStatus.VOIDED);
      expect(payment.voidedAt).toBe(voidedAt);
      expect(payment.voidedBy).toBe('admin');
      expect(payment.voidReason).toBe('Duplicate payment');
    });
  });

  describe('clone', () => {
    it('should create an exact copy of the payment', () => {
      const props = createValidPaymentProps();
      const original = PaymentEntity.create(props, 'user-123')._unsafeUnwrap();

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
      const props = createValidPaymentProps();
      const original = PaymentEntity.create(props, 'user-123')._unsafeUnwrap();
      const cloned = original.clone();

      original.void({ voidedBy: 'admin', voidReason: 'Test void' });

      expect(original.isVoided()).toBe(true);
      expect(cloned.isVoided()).toBe(false);
    });
  });

  describe('isPaid', () => {
    it('should return true when status is PAID', () => {
      const payment = PaymentEntity.create(
        createValidPaymentProps(),
        'user-123',
      )._unsafeUnwrap();

      expect(payment.isPaid()).toBe(true);
    });

    it('should return false when status is VOIDED', () => {
      const payment = PaymentEntity.fromPersistence(
        {
          amount: Amount.fromCents(1000)._unsafeUnwrap(),
          date: DateOnly.fromString('2024-01-01')._unsafeUnwrap(),
          dueIds: [],
          memberId: UniqueId.generate(),
          notes: null,
          receiptNumber: null,
          status: PaymentStatus.VOIDED,
          voidedAt: new Date(),
          voidedBy: 'admin',
          voidReason: 'Test',
        },
        {
          audit: { createdBy: 'user' },
          id: UniqueId.generate(),
        },
      );

      expect(payment.isPaid()).toBe(false);
    });
  });

  describe('isVoided', () => {
    it('should return true when status is VOIDED', () => {
      const payment = PaymentEntity.fromPersistence(
        {
          amount: Amount.fromCents(1000)._unsafeUnwrap(),
          date: DateOnly.fromString('2024-01-01')._unsafeUnwrap(),
          dueIds: [],
          memberId: UniqueId.generate(),
          notes: null,
          receiptNumber: null,
          status: PaymentStatus.VOIDED,
          voidedAt: new Date(),
          voidedBy: 'admin',
          voidReason: 'Test',
        },
        {
          audit: { createdBy: 'user' },
          id: UniqueId.generate(),
        },
      );

      expect(payment.isVoided()).toBe(true);
    });

    it('should return false when status is PAID', () => {
      const payment = PaymentEntity.create(
        createValidPaymentProps(),
        'user-123',
      )._unsafeUnwrap();

      expect(payment.isVoided()).toBe(false);
    });
  });

  describe('void', () => {
    it('should void a paid payment', () => {
      const payment = PaymentEntity.create(
        createValidPaymentProps(),
        'user-123',
      )._unsafeUnwrap();
      payment.pullEvents(); // Clear creation event

      const result = payment.void({
        voidedBy: 'admin',
        voidReason: 'Customer request',
      });

      expect(result.isOk()).toBe(true);
      expect(payment.status).toBe(PaymentStatus.VOIDED);
      expect(payment.voidedBy).toBe('admin');
      expect(payment.voidReason).toBe('Customer request');
      expect(payment.voidedAt).toBeInstanceOf(Date);
      expect(payment.updatedBy).toBe('admin');
    });

    it('should add PaymentUpdatedEvent when voiding', () => {
      const payment = PaymentEntity.create(
        createValidPaymentProps(),
        'user-123',
      )._unsafeUnwrap();
      payment.pullEvents(); // Clear creation event

      payment.void({ voidedBy: 'admin', voidReason: 'Test' });

      const events = payment.pullEvents();
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(PaymentUpdatedEvent);

      const event = events[0] as PaymentUpdatedEvent;
      expect(event.oldPayment.status).toBe(PaymentStatus.PAID);
      expect(event.payment.status).toBe(PaymentStatus.VOIDED);
    });

    it('should fail to void an already voided payment', () => {
      const payment = PaymentEntity.fromPersistence(
        {
          amount: Amount.fromCents(1000)._unsafeUnwrap(),
          date: DateOnly.fromString('2024-01-01')._unsafeUnwrap(),
          dueIds: [],
          memberId: UniqueId.generate(),
          notes: null,
          receiptNumber: null,
          status: PaymentStatus.VOIDED,
          voidedAt: new Date(),
          voidedBy: 'admin',
          voidReason: 'Already voided',
        },
        {
          audit: { createdBy: 'user' },
          id: UniqueId.generate(),
        },
      );

      const result = payment.void({
        voidedBy: 'admin',
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
      const payment1 = PaymentEntity.fromPersistence(
        {
          amount: Amount.fromCents(1000)._unsafeUnwrap(),
          date: DateOnly.fromString('2024-01-01')._unsafeUnwrap(),
          dueIds: [],
          memberId: UniqueId.generate(),
          notes: null,
          receiptNumber: null,
          status: PaymentStatus.PAID,
          voidedAt: null,
          voidedBy: null,
          voidReason: null,
        },
        { audit: { createdBy: 'user' }, id },
      );

      const payment2 = PaymentEntity.fromPersistence(
        {
          amount: Amount.fromCents(2000)._unsafeUnwrap(),
          date: DateOnly.fromString('2024-02-01')._unsafeUnwrap(),
          dueIds: [],
          memberId: UniqueId.generate(),
          notes: 'Different',
          receiptNumber: null,
          status: PaymentStatus.PAID,
          voidedAt: null,
          voidedBy: null,
          voidReason: null,
        },
        { audit: { createdBy: 'admin' }, id },
      );

      expect(payment1.equals(payment2)).toBe(true);
    });

    it('should not be equal when ids differ', () => {
      const baseProps = {
        amount: Amount.fromCents(1000)._unsafeUnwrap(),
        date: DateOnly.fromString('2024-01-01')._unsafeUnwrap(),
        dueIds: [],
        memberId: UniqueId.generate(),
        notes: null,
        receiptNumber: null,
        status: PaymentStatus.PAID,
        voidedAt: null,
        voidedBy: null,
        voidReason: null,
      };

      const payment1 = PaymentEntity.fromPersistence(baseProps, {
        audit: { createdBy: 'user' },
        id: UniqueId.generate(),
      });

      const payment2 = PaymentEntity.fromPersistence(baseProps, {
        audit: { createdBy: 'user' },
        id: UniqueId.generate(),
      });

      expect(payment1.equals(payment2)).toBe(false);
    });
  });
});
