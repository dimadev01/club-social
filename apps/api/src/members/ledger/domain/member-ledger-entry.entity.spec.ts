import {
  MemberLedgerEntrySource,
  MemberLedgerEntryStatus,
  MemberLedgerEntryType,
} from '@club-social/shared/members';

import { SignedAmount } from '@/shared/domain/value-objects/amount/signed-amount.vo';
import { DateOnly } from '@/shared/domain/value-objects/date-only/date-only.vo';
import { UniqueId } from '@/shared/domain/value-objects/unique-id/unique-id.vo';

import { MemberLedgerEntryEntity } from './member-ledger-entry.entity';

describe('MemberLedgerEntryEntity', () => {
  const createValidCreditProps = () => ({
    amount: SignedAmount.fromCents(10000)._unsafeUnwrap(),
    date: DateOnly.fromString('2024-01-15')._unsafeUnwrap(),
    memberId: UniqueId.generate(),
    notes: 'Deposit received',
    paymentId: UniqueId.generate(),
    reversalOfId: null,
    source: MemberLedgerEntrySource.PAYMENT,
    status: MemberLedgerEntryStatus.POSTED,
    type: MemberLedgerEntryType.DEPOSIT_CREDIT,
  });

  const createValidDebitProps = () => ({
    amount: SignedAmount.fromCents(-5000)._unsafeUnwrap(),
    date: DateOnly.fromString('2024-01-15')._unsafeUnwrap(),
    memberId: UniqueId.generate(),
    notes: 'Due settlement',
    paymentId: UniqueId.generate(),
    reversalOfId: null,
    source: MemberLedgerEntrySource.PAYMENT,
    status: MemberLedgerEntryStatus.POSTED,
    type: MemberLedgerEntryType.DUE_APPLY_DEBIT,
  });

  describe('create', () => {
    it('should create a credit entry with valid props', () => {
      const props = createValidCreditProps();
      const createdBy = 'user-123';

      const result = MemberLedgerEntryEntity.create(props, createdBy);

      expect(result.isOk()).toBe(true);
      const entry = result._unsafeUnwrap();
      expect(entry.amount.cents).toBe(10000);
      expect(entry.date.value).toBe('2024-01-15');
      expect(entry.memberId).toBe(props.memberId);
      expect(entry.notes).toBe('Deposit received');
      expect(entry.paymentId).toBe(props.paymentId);
      expect(entry.reversalOfId).toBeNull();
      expect(entry.source).toBe(MemberLedgerEntrySource.PAYMENT);
      expect(entry.status).toBe(MemberLedgerEntryStatus.POSTED);
      expect(entry.type).toBe(MemberLedgerEntryType.DEPOSIT_CREDIT);
      expect(entry.createdBy).toBe(createdBy);
    });

    it('should create a debit entry with valid props', () => {
      const props = createValidDebitProps();

      const result = MemberLedgerEntryEntity.create(props, 'user-123');

      expect(result.isOk()).toBe(true);
      const entry = result._unsafeUnwrap();
      expect(entry.amount.cents).toBe(-5000);
      expect(entry.type).toBe(MemberLedgerEntryType.DUE_APPLY_DEBIT);
    });

    it('should create an entry with null optional fields', () => {
      const props = {
        ...createValidCreditProps(),
        notes: null,
        paymentId: null,
      };

      const result = MemberLedgerEntryEntity.create(props, 'user-123');

      expect(result.isOk()).toBe(true);
      const entry = result._unsafeUnwrap();
      expect(entry.notes).toBeNull();
      expect(entry.paymentId).toBeNull();
    });

    it('should create a reversal entry', () => {
      const originalEntryId = UniqueId.generate();
      const props = {
        ...createValidCreditProps(),
        reversalOfId: originalEntryId,
        type: MemberLedgerEntryType.REVERSAL_CREDIT,
      };

      const result = MemberLedgerEntryEntity.create(props, 'user-123');

      expect(result.isOk()).toBe(true);
      const entry = result._unsafeUnwrap();
      expect(entry.reversalOfId).toBe(originalEntryId);
      expect(entry.type).toBe(MemberLedgerEntryType.REVERSAL_CREDIT);
    });

    it('should generate unique ids for each entry', () => {
      const props = createValidCreditProps();

      const result1 = MemberLedgerEntryEntity.create(props, 'user-123');
      const result2 = MemberLedgerEntryEntity.create(props, 'user-123');

      expect(result1._unsafeUnwrap().id.value).not.toBe(
        result2._unsafeUnwrap().id.value,
      );
    });

    it('should fail to create an entry with zero amount', () => {
      const props = {
        ...createValidCreditProps(),
        amount: SignedAmount.fromCents(0)._unsafeUnwrap(),
      };

      const result = MemberLedgerEntryEntity.create(props, 'user-123');

      expect(result.isErr()).toBe(true);
      expect(result._unsafeUnwrapErr().message).toBe(
        'El monto del movimiento no puede ser cero',
      );
    });
  });

  describe('fromPersistence', () => {
    it('should create an entry from persisted data', () => {
      const id = UniqueId.generate();
      const memberId = UniqueId.generate();
      const paymentId = UniqueId.generate();

      const entry = MemberLedgerEntryEntity.fromPersistence(
        {
          amount: SignedAmount.fromCents(7500)._unsafeUnwrap(),
          date: DateOnly.fromString('2024-02-01')._unsafeUnwrap(),
          memberId,
          notes: 'Adjustment',
          paymentId,
          reversalOfId: null,
          source: MemberLedgerEntrySource.ADJUSTMENT,
          status: MemberLedgerEntryStatus.POSTED,
          type: MemberLedgerEntryType.ADJUSTMENT_CREDIT,
        },
        {
          audit: {
            createdAt: new Date('2024-02-01'),
            createdBy: 'admin',
            updatedAt: null,
            updatedBy: null,
          },
          id,
        },
      );

      expect(entry.id).toBe(id);
      expect(entry.amount.cents).toBe(7500);
      expect(entry.memberId).toBe(memberId);
      expect(entry.source).toBe(MemberLedgerEntrySource.ADJUSTMENT);
      expect(entry.createdBy).toBe('admin');
    });

    it('should create a reversed entry from persisted data', () => {
      const entry = MemberLedgerEntryEntity.fromPersistence(
        {
          amount: SignedAmount.fromCents(5000)._unsafeUnwrap(),
          date: DateOnly.fromString('2024-02-01')._unsafeUnwrap(),
          memberId: UniqueId.generate(),
          notes: null,
          paymentId: null,
          reversalOfId: null,
          source: MemberLedgerEntrySource.PAYMENT,
          status: MemberLedgerEntryStatus.REVERSED,
          type: MemberLedgerEntryType.DEPOSIT_CREDIT,
        },
        {
          audit: { createdBy: 'user' },
          id: UniqueId.generate(),
        },
      );

      expect(entry.status).toBe(MemberLedgerEntryStatus.REVERSED);
    });
  });

  describe('clone', () => {
    it('should create an exact copy of the entry', () => {
      const props = createValidCreditProps();
      const original = MemberLedgerEntryEntity.create(
        props,
        'user-123',
      )._unsafeUnwrap();

      const cloned = original.clone();

      expect(cloned.id.value).toBe(original.id.value);
      expect(cloned.amount.cents).toBe(original.amount.cents);
      expect(cloned.date.value).toBe(original.date.value);
      expect(cloned.memberId.value).toBe(original.memberId.value);
      expect(cloned.notes).toBe(original.notes);
      expect(cloned.source).toBe(original.source);
      expect(cloned.status).toBe(original.status);
      expect(cloned.type).toBe(original.type);
    });

    it('should create an independent copy', () => {
      const props = createValidCreditProps();
      const original = MemberLedgerEntryEntity.create(
        props,
        'user-123',
      )._unsafeUnwrap();
      const cloned = original.clone();

      original.reverse();

      expect(original.status).toBe(MemberLedgerEntryStatus.REVERSED);
      expect(cloned.status).toBe(MemberLedgerEntryStatus.POSTED);
    });
  });

  describe('reverse', () => {
    it('should change status to REVERSED', () => {
      const entry = MemberLedgerEntryEntity.create(
        createValidCreditProps(),
        'user-123',
      )._unsafeUnwrap();

      expect(entry.status).toBe(MemberLedgerEntryStatus.POSTED);

      entry.reverse();

      expect(entry.status).toBe(MemberLedgerEntryStatus.REVERSED);
    });

    it('should be idempotent', () => {
      const entry = MemberLedgerEntryEntity.create(
        createValidCreditProps(),
        'user-123',
      )._unsafeUnwrap();

      entry.reverse();
      entry.reverse();

      expect(entry.status).toBe(MemberLedgerEntryStatus.REVERSED);
    });
  });

  describe('entity equality', () => {
    it('should be equal when ids match', () => {
      const id = UniqueId.generate();
      const memberId = UniqueId.generate();

      const entry1 = MemberLedgerEntryEntity.fromPersistence(
        {
          amount: SignedAmount.fromCents(1000)._unsafeUnwrap(),
          date: DateOnly.fromString('2024-01-01')._unsafeUnwrap(),
          memberId,
          notes: null,
          paymentId: null,
          reversalOfId: null,
          source: MemberLedgerEntrySource.PAYMENT,
          status: MemberLedgerEntryStatus.POSTED,
          type: MemberLedgerEntryType.DEPOSIT_CREDIT,
        },
        { audit: { createdBy: 'user' }, id },
      );

      const entry2 = MemberLedgerEntryEntity.fromPersistence(
        {
          amount: SignedAmount.fromCents(2000)._unsafeUnwrap(),
          date: DateOnly.fromString('2024-02-01')._unsafeUnwrap(),
          memberId: UniqueId.generate(),
          notes: 'Different',
          paymentId: UniqueId.generate(),
          reversalOfId: null,
          source: MemberLedgerEntrySource.ADJUSTMENT,
          status: MemberLedgerEntryStatus.REVERSED,
          type: MemberLedgerEntryType.ADJUSTMENT_DEBIT,
        },
        { audit: { createdBy: 'admin' }, id },
      );

      expect(entry1.equals(entry2)).toBe(true);
    });

    it('should not be equal when ids differ', () => {
      const props = createValidCreditProps();

      const entry1 = MemberLedgerEntryEntity.create(
        props,
        'user-123',
      )._unsafeUnwrap();

      const entry2 = MemberLedgerEntryEntity.create(
        props,
        'user-123',
      )._unsafeUnwrap();

      expect(entry1.equals(entry2)).toBe(false);
    });
  });

  describe('different entry types', () => {
    const entryTypes = Object.values(MemberLedgerEntryType);

    it.each(entryTypes)('should create entry with type %s', (type) => {
      const props = {
        ...createValidCreditProps(),
        type,
      };

      const result = MemberLedgerEntryEntity.create(props, 'user-123');

      expect(result.isOk()).toBe(true);
      expect(result._unsafeUnwrap().type).toBe(type);
    });
  });

  describe('different sources', () => {
    const sources = Object.values(MemberLedgerEntrySource);

    it.each(sources)('should create entry with source %s', (source) => {
      const props = {
        ...createValidCreditProps(),
        source,
      };

      const result = MemberLedgerEntryEntity.create(props, 'user-123');

      expect(result.isOk()).toBe(true);
      expect(result._unsafeUnwrap().source).toBe(source);
    });
  });

  describe('getters', () => {
    it('should return all properties correctly', () => {
      const props = createValidCreditProps();
      const entry = MemberLedgerEntryEntity.create(
        props,
        'user-123',
      )._unsafeUnwrap();

      expect(entry.amount).toBe(props.amount);
      expect(entry.date).toBe(props.date);
      expect(entry.memberId).toBe(props.memberId);
      expect(entry.notes).toBe(props.notes);
      expect(entry.paymentId).toBe(props.paymentId);
      expect(entry.reversalOfId).toBe(props.reversalOfId);
      expect(entry.source).toBe(props.source);
      expect(entry.status).toBe(props.status);
      expect(entry.type).toBe(props.type);
    });
  });
});
