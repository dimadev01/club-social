import { DueCategory, DueStatus } from '@club-social/shared/dues';

import { Amount } from '@/shared/domain/value-objects/amount/amount.vo';
import { SignedAmount } from '@/shared/domain/value-objects/amount/signed-amount.vo';
import { UniqueId } from '@/shared/domain/value-objects/unique-id/unique-id.vo';
import {
  TEST_ALT_DUE_AMOUNT_CENTS,
  TEST_ALT_DUE_NOTES,
  TEST_CREATED_BY,
  TEST_DUE_AMOUNT_CENTS,
  TEST_DUE_DATE,
  TEST_DUE_NOTES,
} from '@/shared/test/constants';
import {
  createDueProps,
  createTestDue,
  createTestDueFromPersistence,
} from '@/shared/test/factories';

import { DueCreatedEvent } from '../events/due-created.event';
import { DueUpdatedEvent } from '../events/due-updated.event';
import { DueEntity } from './due.entity';

describe('DueEntity', () => {
  describe('create', () => {
    it('should create a due with valid props', () => {
      const props = createDueProps();

      const result = DueEntity.create(props, TEST_CREATED_BY);

      expect(result.isOk()).toBe(true);
      const due = result._unsafeUnwrap();
      expect(due.amount.cents).toBe(TEST_DUE_AMOUNT_CENTS);
      expect(due.category).toBe(DueCategory.MEMBERSHIP);
      expect(due.date.value).toBe(TEST_DUE_DATE);
      expect(due.memberId).toBe(props.memberId);
      expect(due.notes).toBe(TEST_DUE_NOTES);
      expect(due.status).toBe(DueStatus.PENDING);
      expect(due.settlements).toHaveLength(0);
      expect(due.voidedAt).toBeNull();
      expect(due.voidedBy).toBeNull();
      expect(due.voidReason).toBeNull();
      expect(due.createdBy).toBe(TEST_CREATED_BY);
    });

    it('should create a due with null notes using overrides', () => {
      const due = createTestDue({ notes: null });

      expect(due.notes).toBeNull();
    });

    it('should create a due with different category using overrides', () => {
      const due = createTestDue({ category: DueCategory.ELECTRICITY });

      expect(due.category).toBe(DueCategory.ELECTRICITY);
    });

    it('should add DueCreatedEvent on creation', () => {
      const due = createTestDue();
      const events = due.pullEvents();

      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(DueCreatedEvent);
      expect((events[0] as DueCreatedEvent).due).toBe(due);
    });

    it('should generate unique ids for each due', () => {
      const due1 = createTestDue();
      const due2 = createTestDue();

      expect(due1.id.value).not.toBe(due2.id.value);
    });

    it('should fail to create a due with zero amount', () => {
      const props = createDueProps({
        amount: Amount.fromCents(0)._unsafeUnwrap(),
      });

      const result = DueEntity.create(props, TEST_CREATED_BY);

      expect(result.isErr()).toBe(true);
      expect(result._unsafeUnwrapErr().message).toBe(
        'El monto de la cuota no puede ser cero',
      );
    });
  });

  describe('fromPersistence', () => {
    it('should create a due from persisted data', () => {
      const id = UniqueId.generate();
      const memberId = UniqueId.generate();

      const due = createTestDueFromPersistence(
        {
          amount: Amount.fromCents(5000)._unsafeUnwrap(),
          category: DueCategory.ELECTRICITY,
          memberId,
          notes: 'Electricity bill',
        },
        {
          audit: {
            createdAt: new Date('2024-01-01'),
            createdBy: TEST_CREATED_BY,
            updatedAt: null,
            updatedBy: null,
          },
          id,
        },
      );

      expect(due.id).toBe(id);
      expect(due.memberId).toBe(memberId);
      expect(due.amount.cents).toBe(5000);
      expect(due.category).toBe(DueCategory.ELECTRICITY);
      expect(due.status).toBe(DueStatus.PENDING);
      expect(due.createdBy).toBe(TEST_CREATED_BY);
    });

    it('should create a voided due from persisted data', () => {
      const voidedAt = new Date('2024-06-01');

      const due = createTestDueFromPersistence({
        status: DueStatus.VOIDED,
        voidedAt,
        voidedBy: TEST_CREATED_BY,
        voidReason: 'Duplicate entry',
      });

      expect(due.status).toBe(DueStatus.VOIDED);
      expect(due.voidedAt).toBe(voidedAt);
      expect(due.voidedBy).toBe(TEST_CREATED_BY);
      expect(due.voidReason).toBe('Duplicate entry');
    });
  });

  describe('clone', () => {
    it('should create an exact copy of the due', () => {
      const original = createTestDue();

      const cloned = original.clone();

      expect(cloned.id.value).toBe(original.id.value);
      expect(cloned.memberId.value).toBe(original.memberId.value);
      expect(cloned.amount.cents).toBe(original.amount.cents);
      expect(cloned.category).toBe(original.category);
      expect(cloned.date.value).toBe(original.date.value);
      expect(cloned.status).toBe(original.status);
      expect(cloned.notes).toBe(original.notes);
    });

    it('should create an independent copy', () => {
      const original = createTestDue();
      original.pullEvents();
      const cloned = original.clone();

      original.update({
        amount: Amount.fromCents(TEST_ALT_DUE_AMOUNT_CENTS)._unsafeUnwrap(),
        notes: TEST_ALT_DUE_NOTES,
        updatedBy: TEST_CREATED_BY,
      });

      expect(original.amount.cents).toBe(TEST_ALT_DUE_AMOUNT_CENTS);
      expect(cloned.amount.cents).toBe(TEST_DUE_AMOUNT_CENTS);
    });
  });

  describe('update', () => {
    it('should update amount and notes on pending due', () => {
      const due = createTestDue();
      due.pullEvents();

      const result = due.update({
        amount: Amount.fromCents(TEST_ALT_DUE_AMOUNT_CENTS)._unsafeUnwrap(),
        notes: TEST_ALT_DUE_NOTES,
        updatedBy: TEST_CREATED_BY,
      });

      expect(result.isOk()).toBe(true);
      expect(due.amount.cents).toBe(TEST_ALT_DUE_AMOUNT_CENTS);
      expect(due.notes).toBe(TEST_ALT_DUE_NOTES);
      expect(due.updatedBy).toBe(TEST_CREATED_BY);
    });

    it('should add DueUpdatedEvent when updating', () => {
      const due = createTestDue();
      due.pullEvents();

      due.update({
        amount: Amount.fromCents(TEST_ALT_DUE_AMOUNT_CENTS)._unsafeUnwrap(),
        notes: null,
        updatedBy: TEST_CREATED_BY,
      });

      const events = due.pullEvents();
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(DueUpdatedEvent);

      const event = events[0] as DueUpdatedEvent;
      expect(event.oldDue.amount.cents).toBe(TEST_DUE_AMOUNT_CENTS);
      expect(event.newDue.amount.cents).toBe(TEST_ALT_DUE_AMOUNT_CENTS);
    });

    it('should fail to update a paid due', () => {
      const due = createTestDueFromPersistence({ status: DueStatus.PAID });

      const result = due.update({
        amount: Amount.fromCents(2000)._unsafeUnwrap(),
        notes: null,
        updatedBy: TEST_CREATED_BY,
      });

      expect(result.isErr()).toBe(true);
      expect(result._unsafeUnwrapErr().message).toBe(
        'No se puede editar una cuota paga',
      );
    });

    it('should fail to update a voided due', () => {
      const due = createTestDueFromPersistence({
        status: DueStatus.VOIDED,
        voidedAt: new Date(),
        voidedBy: TEST_CREATED_BY,
        voidReason: 'Voided',
      });

      const result = due.update({
        amount: Amount.fromCents(2000)._unsafeUnwrap(),
        notes: null,
        updatedBy: TEST_CREATED_BY,
      });

      expect(result.isErr()).toBe(true);
      expect(result._unsafeUnwrapErr().message).toBe(
        'No se puede editar una cuota anulada',
      );
    });
  });

  describe('void', () => {
    it('should void a pending due', () => {
      const due = createTestDue();
      due.pullEvents();

      const result = due.void({
        voidedBy: TEST_CREATED_BY,
        voidReason: 'Duplicate entry',
      });

      expect(result.isOk()).toBe(true);
      expect(due.status).toBe(DueStatus.VOIDED);
      expect(due.voidedBy).toBe(TEST_CREATED_BY);
      expect(due.voidReason).toBe('Duplicate entry');
      expect(due.voidedAt).toBeInstanceOf(Date);
    });

    it('should fail to void a paid due', () => {
      const due = createTestDueFromPersistence({ status: DueStatus.PAID });

      const result = due.void({
        voidedBy: TEST_CREATED_BY,
        voidReason: 'Test',
      });

      expect(result.isErr()).toBe(true);
      expect(result._unsafeUnwrapErr().message).toBe(
        'Solo se pueden anular cuotas pendientes',
      );
    });

    it('should fail to void a partially paid due', () => {
      const due = createTestDueFromPersistence({
        status: DueStatus.PARTIALLY_PAID,
      });

      const result = due.void({
        voidedBy: TEST_CREATED_BY,
        voidReason: 'Test',
      });

      expect(result.isErr()).toBe(true);
    });
  });

  describe('applySettlement', () => {
    it('should apply a valid settlement to pending due', () => {
      const due = createTestDue();
      due.pullEvents();

      const result = due.applySettlement({
        amount: Amount.fromCents(5000)._unsafeUnwrap(),
        createdBy: TEST_CREATED_BY,
        memberLedgerEntryId: UniqueId.generate(),
        paymentId: UniqueId.generate(),
      });

      expect(result.isOk()).toBe(true);
      expect(due.settlements).toHaveLength(1);
      expect(due.settledAmount.cents).toBe(5000);
      expect(due.pendingAmount.cents).toBe(5000);
      expect(due.status).toBe(DueStatus.PARTIALLY_PAID);
    });

    it('should mark as paid when fully settled', () => {
      const due = createTestDue();

      due.applySettlement({
        amount: Amount.fromCents(TEST_DUE_AMOUNT_CENTS)._unsafeUnwrap(),
        createdBy: TEST_CREATED_BY,
        memberLedgerEntryId: UniqueId.generate(),
        paymentId: UniqueId.generate(),
      });

      expect(due.status).toBe(DueStatus.PAID);
      expect(due.pendingAmount.cents).toBe(0);
    });

    it('should fail to apply settlement to voided due', () => {
      const due = createTestDueFromPersistence({
        status: DueStatus.VOIDED,
        voidedAt: new Date(),
        voidedBy: TEST_CREATED_BY,
        voidReason: 'Test',
      });

      const result = due.applySettlement({
        amount: Amount.fromCents(500)._unsafeUnwrap(),
        createdBy: TEST_CREATED_BY,
        memberLedgerEntryId: UniqueId.generate(),
        paymentId: UniqueId.generate(),
      });

      expect(result.isErr()).toBe(true);
      expect(result._unsafeUnwrapErr().message).toBe(
        'No se puede imputar un pago a una cuota anulada',
      );
    });

    it('should fail to apply settlement to paid due', () => {
      const due = createTestDueFromPersistence({ status: DueStatus.PAID });

      const result = due.applySettlement({
        amount: Amount.fromCents(500)._unsafeUnwrap(),
        createdBy: TEST_CREATED_BY,
        memberLedgerEntryId: UniqueId.generate(),
        paymentId: UniqueId.generate(),
      });

      expect(result.isErr()).toBe(true);
      expect(result._unsafeUnwrapErr().message).toBe(
        'No se puede imputar un pago a una cuota ya paga',
      );
    });

    it('should fail when settlement exceeds due amount', () => {
      const due = createTestDue();

      const result = due.applySettlement({
        amount: Amount.fromCents(TEST_DUE_AMOUNT_CENTS + 5000)._unsafeUnwrap(),
        createdBy: TEST_CREATED_BY,
        memberLedgerEntryId: UniqueId.generate(),
        paymentId: UniqueId.generate(),
      });

      expect(result.isErr()).toBe(true);
      expect(result._unsafeUnwrapErr().message).toBe(
        'El monto imputado excede el total de la cuota',
      );
    });

    it('should fail when settlement amount is negative', () => {
      const due = createTestDue();

      const result = due.applySettlement({
        amount: SignedAmount.raw({ cents: -500 }),
        createdBy: TEST_CREATED_BY,
        memberLedgerEntryId: UniqueId.generate(),
        paymentId: UniqueId.generate(),
      });

      expect(result.isErr()).toBe(true);
      expect(result._unsafeUnwrapErr().message).toBe(
        'El monto a imputar debe ser positivo',
      );
    });
  });

  describe('getDueSettlementByPaymentId', () => {
    it('should return the settlement for the given payment id', () => {
      const due = createTestDue();
      const paymentId = UniqueId.generate();

      due.applySettlement({
        amount: Amount.fromCents(5000)._unsafeUnwrap(),
        createdBy: TEST_CREATED_BY,
        memberLedgerEntryId: UniqueId.generate(),
        paymentId,
      });

      const settlement = due.getDueSettlementByPaymentId(paymentId);

      expect(settlement).toBeDefined();
      expect(settlement.paymentId?.equals(paymentId)).toBe(true);
      expect(settlement.amount.cents).toBe(5000);
    });
  });

  describe('voidPayment', () => {
    it('should void a payment and recalculate status to pending', () => {
      const due = createTestDue();
      const paymentId = UniqueId.generate();

      due.applySettlement({
        amount: Amount.fromCents(5000)._unsafeUnwrap(),
        createdBy: TEST_CREATED_BY,
        memberLedgerEntryId: UniqueId.generate(),
        paymentId,
      });
      due.pullEvents();

      expect(due.status).toBe(DueStatus.PARTIALLY_PAID);

      const result = due.voidPayment({
        paymentId,
        voidedBy: TEST_CREATED_BY,
      });

      expect(result.isOk()).toBe(true);
      expect(due.status).toBe(DueStatus.PENDING);
      expect(due.settledAmount.cents).toBe(0);

      const settlement = due.getDueSettlementByPaymentId(paymentId);
      expect(settlement.isVoided()).toBe(true);
    });

    it('should void a payment and recalculate status to partially paid', () => {
      const due = createTestDue();
      const paymentId1 = UniqueId.generate();
      const paymentId2 = UniqueId.generate();

      due.applySettlement({
        amount: Amount.fromCents(3000)._unsafeUnwrap(),
        createdBy: TEST_CREATED_BY,
        memberLedgerEntryId: UniqueId.generate(),
        paymentId: paymentId1,
      });

      due.applySettlement({
        amount: Amount.fromCents(4000)._unsafeUnwrap(),
        createdBy: TEST_CREATED_BY,
        memberLedgerEntryId: UniqueId.generate(),
        paymentId: paymentId2,
      });
      due.pullEvents();

      expect(due.status).toBe(DueStatus.PARTIALLY_PAID);
      expect(due.settledAmount.cents).toBe(7000);

      due.voidPayment({
        paymentId: paymentId2,
        voidedBy: TEST_CREATED_BY,
      });

      expect(due.status).toBe(DueStatus.PARTIALLY_PAID);
      expect(due.settledAmount.cents).toBe(3000);
    });

    it('should void a payment on a paid due and recalculate status', () => {
      const due = createTestDue();
      const paymentId = UniqueId.generate();

      due.applySettlement({
        amount: Amount.fromCents(TEST_DUE_AMOUNT_CENTS)._unsafeUnwrap(),
        createdBy: TEST_CREATED_BY,
        memberLedgerEntryId: UniqueId.generate(),
        paymentId,
      });
      due.pullEvents();

      expect(due.status).toBe(DueStatus.PAID);

      due.voidPayment({
        paymentId,
        voidedBy: TEST_CREATED_BY,
      });

      expect(due.status).toBe(DueStatus.PENDING);
      expect(due.settledAmount.cents).toBe(0);
      expect(due.pendingAmount.cents).toBe(TEST_DUE_AMOUNT_CENTS);
    });
  });

  describe('status checks', () => {
    it('isPending should return true for pending dues', () => {
      const due = createTestDue();

      expect(due.isPending()).toBe(true);
      expect(due.isPaid()).toBe(false);
      expect(due.isPartiallyPaid()).toBe(false);
      expect(due.isVoided()).toBe(false);
    });

    it('isPaid should return true for paid dues', () => {
      const due = createTestDueFromPersistence({ status: DueStatus.PAID });

      expect(due.isPaid()).toBe(true);
      expect(due.isPending()).toBe(false);
    });

    it('isPartiallyPaid should return true for partially paid dues', () => {
      const due = createTestDueFromPersistence({
        status: DueStatus.PARTIALLY_PAID,
      });

      expect(due.isPartiallyPaid()).toBe(true);
    });

    it('isVoided should return true for voided dues', () => {
      const due = createTestDueFromPersistence({
        status: DueStatus.VOIDED,
        voidedAt: new Date(),
        voidedBy: TEST_CREATED_BY,
        voidReason: 'Test',
      });

      expect(due.isVoided()).toBe(true);
    });
  });

  describe('settledAmount and pendingAmount', () => {
    it('should return zero settled and full pending for dues with no settlements', () => {
      const due = createTestDue();

      expect(due.settledAmount.cents).toBe(0);
      expect(due.pendingAmount.cents).toBe(TEST_DUE_AMOUNT_CENTS);
    });
  });

  describe('entity equality', () => {
    it('should be equal when ids match', () => {
      const id = UniqueId.generate();

      const due1 = createTestDueFromPersistence(
        { status: DueStatus.PENDING },
        { id },
      );

      const due2 = createTestDueFromPersistence(
        {
          amount: Amount.fromCents(2000)._unsafeUnwrap(),
          category: DueCategory.ELECTRICITY,
          notes: 'Different',
          status: DueStatus.PAID,
        },
        { id },
      );

      expect(due1.equals(due2)).toBe(true);
    });
  });
});
