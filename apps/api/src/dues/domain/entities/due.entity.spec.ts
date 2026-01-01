import { DueCategory, DueStatus } from '@club-social/shared/dues';

import { Amount } from '@/shared/domain/value-objects/amount/amount.vo';
import { SignedAmount } from '@/shared/domain/value-objects/amount/signed-amount.vo';
import { DateOnly } from '@/shared/domain/value-objects/date-only/date-only.vo';
import { UniqueId } from '@/shared/domain/value-objects/unique-id/unique-id.vo';
import {
  TEST_ALT_DUE_AMOUNT_CENTS,
  TEST_ALT_DUE_NOTES,
  TEST_CREATED_BY,
  TEST_DUE_AMOUNT_CENTS,
  TEST_DUE_DATE,
  TEST_DUE_NOTES,
} from '@/shared/test/constants';
import { createDueProps, createTestDue } from '@/shared/test/factories';

import { DueCreatedEvent } from '../events/due-created.event';
import { DueUpdatedEvent } from '../events/due-updated.event';
import { DueEntity } from './due.entity';

describe('DueEntity', () => {
  describe('create', () => {
    it('should create a due with valid props', () => {
      const memberId = UniqueId.generate();
      const props = createDueProps(memberId);

      const result = DueEntity.create(props, TEST_CREATED_BY);

      expect(result.isOk()).toBe(true);
      const due = result._unsafeUnwrap();
      expect(due.amount.cents).toBe(TEST_DUE_AMOUNT_CENTS);
      expect(due.category).toBe(DueCategory.MEMBERSHIP);
      expect(due.date.value).toBe(TEST_DUE_DATE);
      expect(due.memberId).toBe(memberId);
      expect(due.notes).toBe(TEST_DUE_NOTES);
      expect(due.status).toBe(DueStatus.PENDING);
      expect(due.settlements).toHaveLength(0);
      expect(due.voidedAt).toBeNull();
      expect(due.voidedBy).toBeNull();
      expect(due.voidReason).toBeNull();
      expect(due.createdBy).toBe(TEST_CREATED_BY);
    });

    it('should create a due with null notes using overrides', () => {
      const memberId = UniqueId.generate();

      const due = createTestDue(memberId, { notes: null });

      expect(due.notes).toBeNull();
    });

    it('should create a due with different category using overrides', () => {
      const memberId = UniqueId.generate();

      const due = createTestDue(memberId, {
        category: DueCategory.ELECTRICITY,
      });

      expect(due.category).toBe(DueCategory.ELECTRICITY);
    });

    it('should add DueCreatedEvent on creation', () => {
      const memberId = UniqueId.generate();

      const due = createTestDue(memberId);
      const events = due.pullEvents();

      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(DueCreatedEvent);
      expect((events[0] as DueCreatedEvent).due).toBe(due);
    });

    it('should generate unique ids for each due', () => {
      const memberId = UniqueId.generate();

      const due1 = createTestDue(memberId);
      const due2 = createTestDue(memberId);

      expect(due1.id.value).not.toBe(due2.id.value);
    });
  });

  describe('fromPersistence', () => {
    it('should create a due from persisted data', () => {
      const id = UniqueId.generate();
      const memberId = UniqueId.generate();

      const due = DueEntity.fromPersistence(
        {
          amount: Amount.fromCents(5000)._unsafeUnwrap(),
          category: DueCategory.ELECTRICITY,
          date: DateOnly.fromString('2024-02-01')._unsafeUnwrap(),
          memberId,
          notes: 'Electricity bill',
          settlements: [],
          status: DueStatus.PENDING,
          voidedAt: null,
          voidedBy: null,
          voidReason: null,
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

      const due = DueEntity.fromPersistence(
        {
          amount: Amount.fromCents(1000)._unsafeUnwrap(),
          category: DueCategory.MEMBERSHIP,
          date: DateOnly.fromString('2024-01-01')._unsafeUnwrap(),
          memberId: UniqueId.generate(),
          notes: null,
          settlements: [],
          status: DueStatus.VOIDED,
          voidedAt,
          voidedBy: TEST_CREATED_BY,
          voidReason: 'Duplicate entry',
        },
        {
          audit: { createdBy: TEST_CREATED_BY },
          id: UniqueId.generate(),
        },
      );

      expect(due.status).toBe(DueStatus.VOIDED);
      expect(due.voidedAt).toBe(voidedAt);
      expect(due.voidedBy).toBe(TEST_CREATED_BY);
      expect(due.voidReason).toBe('Duplicate entry');
    });
  });

  describe('clone', () => {
    it('should create an exact copy of the due', () => {
      const memberId = UniqueId.generate();
      const original = createTestDue(memberId);

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
      const memberId = UniqueId.generate();
      const original = createTestDue(memberId);
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
      const memberId = UniqueId.generate();
      const due = createTestDue(memberId);
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
      const memberId = UniqueId.generate();
      const due = createTestDue(memberId);
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
      expect(event.due.amount.cents).toBe(TEST_ALT_DUE_AMOUNT_CENTS);
    });

    it('should fail to update a paid due', () => {
      const due = DueEntity.fromPersistence(
        {
          amount: Amount.fromCents(1000)._unsafeUnwrap(),
          category: DueCategory.MEMBERSHIP,
          date: DateOnly.fromString('2024-01-01')._unsafeUnwrap(),
          memberId: UniqueId.generate(),
          notes: null,
          settlements: [],
          status: DueStatus.PAID,
          voidedAt: null,
          voidedBy: null,
          voidReason: null,
        },
        { audit: { createdBy: TEST_CREATED_BY }, id: UniqueId.generate() },
      );

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
      const due = DueEntity.fromPersistence(
        {
          amount: Amount.fromCents(1000)._unsafeUnwrap(),
          category: DueCategory.MEMBERSHIP,
          date: DateOnly.fromString('2024-01-01')._unsafeUnwrap(),
          memberId: UniqueId.generate(),
          notes: null,
          settlements: [],
          status: DueStatus.VOIDED,
          voidedAt: new Date(),
          voidedBy: TEST_CREATED_BY,
          voidReason: 'Voided',
        },
        { audit: { createdBy: TEST_CREATED_BY }, id: UniqueId.generate() },
      );

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
      const memberId = UniqueId.generate();
      const due = createTestDue(memberId);
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
      const due = DueEntity.fromPersistence(
        {
          amount: Amount.fromCents(1000)._unsafeUnwrap(),
          category: DueCategory.MEMBERSHIP,
          date: DateOnly.fromString('2024-01-01')._unsafeUnwrap(),
          memberId: UniqueId.generate(),
          notes: null,
          settlements: [],
          status: DueStatus.PAID,
          voidedAt: null,
          voidedBy: null,
          voidReason: null,
        },
        { audit: { createdBy: TEST_CREATED_BY }, id: UniqueId.generate() },
      );

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
      const due = DueEntity.fromPersistence(
        {
          amount: Amount.fromCents(1000)._unsafeUnwrap(),
          category: DueCategory.MEMBERSHIP,
          date: DateOnly.fromString('2024-01-01')._unsafeUnwrap(),
          memberId: UniqueId.generate(),
          notes: null,
          settlements: [],
          status: DueStatus.PARTIALLY_PAID,
          voidedAt: null,
          voidedBy: null,
          voidReason: null,
        },
        { audit: { createdBy: TEST_CREATED_BY }, id: UniqueId.generate() },
      );

      const result = due.void({
        voidedBy: TEST_CREATED_BY,
        voidReason: 'Test',
      });

      expect(result.isErr()).toBe(true);
    });
  });

  describe('applySettlement', () => {
    it('should apply a valid settlement to pending due', () => {
      const memberId = UniqueId.generate();
      const due = createTestDue(memberId);
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
      const memberId = UniqueId.generate();
      const due = createTestDue(memberId);

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
      const due = DueEntity.fromPersistence(
        {
          amount: Amount.fromCents(1000)._unsafeUnwrap(),
          category: DueCategory.MEMBERSHIP,
          date: DateOnly.fromString('2024-01-01')._unsafeUnwrap(),
          memberId: UniqueId.generate(),
          notes: null,
          settlements: [],
          status: DueStatus.VOIDED,
          voidedAt: new Date(),
          voidedBy: TEST_CREATED_BY,
          voidReason: 'Test',
        },
        { audit: { createdBy: TEST_CREATED_BY }, id: UniqueId.generate() },
      );

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
      const due = DueEntity.fromPersistence(
        {
          amount: Amount.fromCents(1000)._unsafeUnwrap(),
          category: DueCategory.MEMBERSHIP,
          date: DateOnly.fromString('2024-01-01')._unsafeUnwrap(),
          memberId: UniqueId.generate(),
          notes: null,
          settlements: [],
          status: DueStatus.PAID,
          voidedAt: null,
          voidedBy: null,
          voidReason: null,
        },
        { audit: { createdBy: TEST_CREATED_BY }, id: UniqueId.generate() },
      );

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
      const memberId = UniqueId.generate();
      const due = createTestDue(memberId);

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
      const memberId = UniqueId.generate();
      const due = createTestDue(memberId);

      const result = due.applySettlement({
        amount: SignedAmount.raw({ cents: -500 }) as Amount,
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
      const memberId = UniqueId.generate();
      const due = createTestDue(memberId);
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
      const memberId = UniqueId.generate();
      const due = createTestDue(memberId);
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
      const memberId = UniqueId.generate();
      const due = createTestDue(memberId);
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
      const memberId = UniqueId.generate();
      const due = createTestDue(memberId);
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
      const memberId = UniqueId.generate();
      const due = createTestDue(memberId);

      expect(due.isPending()).toBe(true);
      expect(due.isPaid()).toBe(false);
      expect(due.isPartiallyPaid()).toBe(false);
      expect(due.isVoided()).toBe(false);
    });

    it('isPaid should return true for paid dues', () => {
      const due = DueEntity.fromPersistence(
        {
          amount: Amount.fromCents(1000)._unsafeUnwrap(),
          category: DueCategory.MEMBERSHIP,
          date: DateOnly.fromString('2024-01-01')._unsafeUnwrap(),
          memberId: UniqueId.generate(),
          notes: null,
          settlements: [],
          status: DueStatus.PAID,
          voidedAt: null,
          voidedBy: null,
          voidReason: null,
        },
        { audit: { createdBy: TEST_CREATED_BY }, id: UniqueId.generate() },
      );

      expect(due.isPaid()).toBe(true);
      expect(due.isPending()).toBe(false);
    });

    it('isPartiallyPaid should return true for partially paid dues', () => {
      const due = DueEntity.fromPersistence(
        {
          amount: Amount.fromCents(1000)._unsafeUnwrap(),
          category: DueCategory.MEMBERSHIP,
          date: DateOnly.fromString('2024-01-01')._unsafeUnwrap(),
          memberId: UniqueId.generate(),
          notes: null,
          settlements: [],
          status: DueStatus.PARTIALLY_PAID,
          voidedAt: null,
          voidedBy: null,
          voidReason: null,
        },
        { audit: { createdBy: TEST_CREATED_BY }, id: UniqueId.generate() },
      );

      expect(due.isPartiallyPaid()).toBe(true);
    });

    it('isVoided should return true for voided dues', () => {
      const due = DueEntity.fromPersistence(
        {
          amount: Amount.fromCents(1000)._unsafeUnwrap(),
          category: DueCategory.MEMBERSHIP,
          date: DateOnly.fromString('2024-01-01')._unsafeUnwrap(),
          memberId: UniqueId.generate(),
          notes: null,
          settlements: [],
          status: DueStatus.VOIDED,
          voidedAt: new Date(),
          voidedBy: TEST_CREATED_BY,
          voidReason: 'Test',
        },
        { audit: { createdBy: TEST_CREATED_BY }, id: UniqueId.generate() },
      );

      expect(due.isVoided()).toBe(true);
    });
  });

  describe('settledAmount and pendingAmount', () => {
    it('should return zero settled and full pending for dues with no settlements', () => {
      const memberId = UniqueId.generate();
      const due = createTestDue(memberId);

      expect(due.settledAmount.cents).toBe(0);
      expect(due.pendingAmount.cents).toBe(TEST_DUE_AMOUNT_CENTS);
    });
  });

  describe('entity equality', () => {
    it('should be equal when ids match', () => {
      const id = UniqueId.generate();

      const due1 = DueEntity.fromPersistence(
        {
          amount: Amount.fromCents(1000)._unsafeUnwrap(),
          category: DueCategory.MEMBERSHIP,
          date: DateOnly.fromString('2024-01-01')._unsafeUnwrap(),
          memberId: UniqueId.generate(),
          notes: null,
          settlements: [],
          status: DueStatus.PENDING,
          voidedAt: null,
          voidedBy: null,
          voidReason: null,
        },
        { audit: { createdBy: TEST_CREATED_BY }, id },
      );

      const due2 = DueEntity.fromPersistence(
        {
          amount: Amount.fromCents(2000)._unsafeUnwrap(),
          category: DueCategory.ELECTRICITY,
          date: DateOnly.fromString('2024-02-01')._unsafeUnwrap(),
          memberId: UniqueId.generate(),
          notes: 'Different',
          settlements: [],
          status: DueStatus.PAID,
          voidedAt: null,
          voidedBy: null,
          voidReason: null,
        },
        { audit: { createdBy: TEST_CREATED_BY }, id },
      );

      expect(due1.equals(due2)).toBe(true);
    });
  });
});
