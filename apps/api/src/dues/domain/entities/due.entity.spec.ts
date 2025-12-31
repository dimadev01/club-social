import { DueCategory, DueStatus } from '@club-social/shared/dues';

import { Amount } from '@/shared/domain/value-objects/amount/amount.vo';
import { DateOnly } from '@/shared/domain/value-objects/date-only/date-only.vo';
import { UniqueId } from '@/shared/domain/value-objects/unique-id/unique-id.vo';

import { DueCreatedEvent } from '../events/due-created.event';
import { DueUpdatedEvent } from '../events/due-updated.event';
import { DueEntity } from './due.entity';

describe('DueEntity', () => {
  const createValidDueProps = () => ({
    amount: Amount.fromCents(10000)._unsafeUnwrap(),
    category: DueCategory.MEMBERSHIP,
    date: DateOnly.fromString('2024-01-15')._unsafeUnwrap(),
    memberId: UniqueId.generate(),
    notes: 'Monthly membership',
  });

  describe('create', () => {
    it('should create a due with valid props', () => {
      const props = createValidDueProps();
      const createdBy = 'user-123';

      const result = DueEntity.create(props, createdBy);

      expect(result.isOk()).toBe(true);
      const due = result._unsafeUnwrap();
      expect(due.amount.cents).toBe(10000);
      expect(due.category).toBe(DueCategory.MEMBERSHIP);
      expect(due.date.value).toBe('2024-01-15');
      expect(due.memberId).toBe(props.memberId);
      expect(due.notes).toBe('Monthly membership');
      expect(due.status).toBe(DueStatus.PENDING);
      expect(due.settlements).toHaveLength(0);
      expect(due.voidedAt).toBeNull();
      expect(due.voidedBy).toBeNull();
      expect(due.voidReason).toBeNull();
      expect(due.createdBy).toBe(createdBy);
    });

    it('should create a due with null notes', () => {
      const props = { ...createValidDueProps(), notes: null };

      const result = DueEntity.create(props, 'user-123');

      expect(result.isOk()).toBe(true);
      expect(result._unsafeUnwrap().notes).toBeNull();
    });

    it('should add DueCreatedEvent on creation', () => {
      const props = createValidDueProps();

      const result = DueEntity.create(props, 'user-123');
      const due = result._unsafeUnwrap();
      const events = due.pullEvents();

      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(DueCreatedEvent);
      expect((events[0] as DueCreatedEvent).due).toBe(due);
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
          audit: { createdBy: 'admin' },
          id,
        },
      );

      expect(due.id).toBe(id);
      expect(due.amount.cents).toBe(5000);
      expect(due.category).toBe(DueCategory.ELECTRICITY);
      expect(due.status).toBe(DueStatus.PENDING);
    });
  });

  describe('clone', () => {
    it('should create an exact copy of the due', () => {
      const props = createValidDueProps();
      const original = DueEntity.create(props, 'user-123')._unsafeUnwrap();

      const cloned = original.clone();

      expect(cloned.id.value).toBe(original.id.value);
      expect(cloned.amount.cents).toBe(original.amount.cents);
      expect(cloned.category).toBe(original.category);
      expect(cloned.date.value).toBe(original.date.value);
      expect(cloned.memberId.value).toBe(original.memberId.value);
      expect(cloned.status).toBe(original.status);
    });
  });

  describe('status checks', () => {
    it('isPending should return true for pending dues', () => {
      const due = DueEntity.create(
        createValidDueProps(),
        'user-123',
      )._unsafeUnwrap();

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
        { audit: { createdBy: 'user' }, id: UniqueId.generate() },
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
        { audit: { createdBy: 'user' }, id: UniqueId.generate() },
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
          voidedBy: 'admin',
          voidReason: 'Test',
        },
        { audit: { createdBy: 'user' }, id: UniqueId.generate() },
      );

      expect(due.isVoided()).toBe(true);
    });
  });

  describe('settledAmount and pendingAmount', () => {
    it('should return zero for dues with no settlements', () => {
      const due = DueEntity.create(
        createValidDueProps(),
        'user-123',
      )._unsafeUnwrap();

      expect(due.settledAmount.cents).toBe(0);
      expect(due.pendingAmount.cents).toBe(10000);
    });
  });

  describe('update', () => {
    it('should update amount and notes on pending due', () => {
      const due = DueEntity.create(
        createValidDueProps(),
        'user-123',
      )._unsafeUnwrap();
      due.pullEvents(); // Clear creation event

      const result = due.update({
        amount: Amount.fromCents(15000)._unsafeUnwrap(),
        notes: 'Updated notes',
        updatedBy: 'admin',
      });

      expect(result.isOk()).toBe(true);
      expect(due.amount.cents).toBe(15000);
      expect(due.notes).toBe('Updated notes');
      expect(due.updatedBy).toBe('admin');
    });

    it('should add DueUpdatedEvent when updating', () => {
      const due = DueEntity.create(
        createValidDueProps(),
        'user-123',
      )._unsafeUnwrap();
      due.pullEvents();

      due.update({
        amount: Amount.fromCents(15000)._unsafeUnwrap(),
        notes: null,
        updatedBy: 'admin',
      });

      const events = due.pullEvents();
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(DueUpdatedEvent);
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
        { audit: { createdBy: 'user' }, id: UniqueId.generate() },
      );

      const result = due.update({
        amount: Amount.fromCents(2000)._unsafeUnwrap(),
        notes: null,
        updatedBy: 'admin',
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
          voidedBy: 'admin',
          voidReason: 'Voided',
        },
        { audit: { createdBy: 'user' }, id: UniqueId.generate() },
      );

      const result = due.update({
        amount: Amount.fromCents(2000)._unsafeUnwrap(),
        notes: null,
        updatedBy: 'admin',
      });

      expect(result.isErr()).toBe(true);
      expect(result._unsafeUnwrapErr().message).toBe(
        'No se puede editar una cuota anulada',
      );
    });
  });

  describe('void', () => {
    it('should void a pending due', () => {
      const due = DueEntity.create(
        createValidDueProps(),
        'user-123',
      )._unsafeUnwrap();
      due.pullEvents();

      const result = due.void({
        voidedBy: 'admin',
        voidReason: 'Duplicate entry',
      });

      expect(result.isOk()).toBe(true);
      expect(due.status).toBe(DueStatus.VOIDED);
      expect(due.voidedBy).toBe('admin');
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
        { audit: { createdBy: 'user' }, id: UniqueId.generate() },
      );

      const result = due.void({ voidedBy: 'admin', voidReason: 'Test' });

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
        { audit: { createdBy: 'user' }, id: UniqueId.generate() },
      );

      const result = due.void({ voidedBy: 'admin', voidReason: 'Test' });

      expect(result.isErr()).toBe(true);
    });
  });

  describe('applySettlement', () => {
    it('should apply a valid settlement to pending due', () => {
      const due = DueEntity.create(
        createValidDueProps(),
        'user-123',
      )._unsafeUnwrap();
      due.pullEvents();

      const result = due.applySettlement({
        amount: Amount.fromCents(5000)._unsafeUnwrap(),
        createdBy: 'admin',
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
      const due = DueEntity.create(
        createValidDueProps(),
        'user-123',
      )._unsafeUnwrap();

      due.applySettlement({
        amount: Amount.fromCents(10000)._unsafeUnwrap(),
        createdBy: 'admin',
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
          voidedBy: 'admin',
          voidReason: 'Test',
        },
        { audit: { createdBy: 'user' }, id: UniqueId.generate() },
      );

      const result = due.applySettlement({
        amount: Amount.fromCents(500)._unsafeUnwrap(),
        createdBy: 'admin',
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
        { audit: { createdBy: 'user' }, id: UniqueId.generate() },
      );

      const result = due.applySettlement({
        amount: Amount.fromCents(500)._unsafeUnwrap(),
        createdBy: 'admin',
        memberLedgerEntryId: UniqueId.generate(),
        paymentId: UniqueId.generate(),
      });

      expect(result.isErr()).toBe(true);
      expect(result._unsafeUnwrapErr().message).toBe(
        'No se puede imputar un pago a una cuota ya paga',
      );
    });

    it('should fail when settlement exceeds due amount', () => {
      const due = DueEntity.create(
        createValidDueProps(),
        'user-123',
      )._unsafeUnwrap();

      const result = due.applySettlement({
        amount: Amount.fromCents(15000)._unsafeUnwrap(),
        createdBy: 'admin',
        memberLedgerEntryId: UniqueId.generate(),
        paymentId: UniqueId.generate(),
      });

      expect(result.isErr()).toBe(true);
      expect(result._unsafeUnwrapErr().message).toBe(
        'El monto imputado excede el total de la cuota',
      );
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
        { audit: { createdBy: 'user' }, id },
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
        { audit: { createdBy: 'admin' }, id },
      );

      expect(due1.equals(due2)).toBe(true);
    });
  });
});
