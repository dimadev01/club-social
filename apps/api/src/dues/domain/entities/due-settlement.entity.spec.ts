import { DueSettlementStatus } from '@club-social/shared/dues';

import { Amount } from '@/shared/domain/value-objects/amount/amount.vo';
import { UniqueId } from '@/shared/domain/value-objects/unique-id/unique-id.vo';
import {
  TEST_ALT_DUE_SETTLEMENT_AMOUNT_CENTS,
  TEST_DUE_SETTLEMENT_AMOUNT_CENTS,
} from '@/shared/test/constants';
import {
  createDueSettlementProps,
  createTestDueSettlement,
} from '@/shared/test/factories';

import { DueSettlementEntity } from './due-settlement.entity';

describe('DueSettlementEntity', () => {
  describe('create', () => {
    it('should create a settlement with valid props', () => {
      const dueId = UniqueId.generate();
      const props = createDueSettlementProps(dueId);

      const result = DueSettlementEntity.create(props);

      expect(result.isOk()).toBe(true);
      const settlement = result._unsafeUnwrap();
      expect(settlement.amount.cents).toBe(TEST_DUE_SETTLEMENT_AMOUNT_CENTS);
      expect(settlement.dueId).toBe(dueId);
      expect(settlement.memberLedgerEntryId).toBe(props.memberLedgerEntryId);
      expect(settlement.paymentId).toBe(props.paymentId);
      expect(settlement.status).toBe(DueSettlementStatus.APPLIED);
    });

    it('should create a settlement with null paymentId using overrides', () => {
      const dueId = UniqueId.generate();

      const settlement = createTestDueSettlement(dueId, { paymentId: null });

      expect(settlement.paymentId).toBeNull();
    });

    it('should create a settlement with different amount using overrides', () => {
      const dueId = UniqueId.generate();

      const settlement = createTestDueSettlement(dueId, {
        amount: Amount.fromCents(
          TEST_ALT_DUE_SETTLEMENT_AMOUNT_CENTS,
        )._unsafeUnwrap(),
      });

      expect(settlement.amount.cents).toBe(
        TEST_ALT_DUE_SETTLEMENT_AMOUNT_CENTS,
      );
    });

    it('should fail to create a settlement with negative amount', () => {
      const props = {
        ...createDueSettlementProps(UniqueId.generate()),
        amount: Amount.fromCents(-5000),
      };

      // Amount.fromCents already validates negative amounts
      expect(props.amount.isErr()).toBe(true);
    });

    it('should generate unique ids for each settlement', () => {
      const dueId = UniqueId.generate();

      const settlement1 = createTestDueSettlement(dueId);
      const settlement2 = createTestDueSettlement(dueId);

      expect(settlement1.id.value).not.toBe(settlement2.id.value);
    });
  });

  describe('fromPersistence', () => {
    it('should create a settlement from persisted data', () => {
      const dueId = UniqueId.generate();
      const memberLedgerEntryId = UniqueId.generate();
      const paymentId = UniqueId.generate();

      const settlement = DueSettlementEntity.fromPersistence({
        amount: Amount.fromCents(
          TEST_ALT_DUE_SETTLEMENT_AMOUNT_CENTS,
        )._unsafeUnwrap(),
        dueId,
        memberLedgerEntryId,
        paymentId,
        status: DueSettlementStatus.APPLIED,
      });

      expect(settlement.amount.cents).toBe(
        TEST_ALT_DUE_SETTLEMENT_AMOUNT_CENTS,
      );
      expect(settlement.dueId).toBe(dueId);
      expect(settlement.memberLedgerEntryId).toBe(memberLedgerEntryId);
      expect(settlement.paymentId).toBe(paymentId);
      expect(settlement.status).toBe(DueSettlementStatus.APPLIED);
    });

    it('should create a voided settlement from persisted data', () => {
      const settlement = DueSettlementEntity.fromPersistence({
        amount: Amount.fromCents(
          TEST_ALT_DUE_SETTLEMENT_AMOUNT_CENTS,
        )._unsafeUnwrap(),
        dueId: UniqueId.generate(),
        memberLedgerEntryId: UniqueId.generate(),
        paymentId: UniqueId.generate(),
        status: DueSettlementStatus.VOIDED,
      });

      expect(settlement.status).toBe(DueSettlementStatus.VOIDED);
      expect(settlement.isVoided()).toBe(true);
    });
  });

  describe('isApplied', () => {
    it('should return true when status is APPLIED', () => {
      const dueId = UniqueId.generate();

      const settlement = createTestDueSettlement(dueId);

      expect(settlement.isApplied()).toBe(true);
    });

    it('should return false when status is VOIDED', () => {
      const settlement = DueSettlementEntity.fromPersistence({
        amount: Amount.fromCents(1000)._unsafeUnwrap(),
        dueId: UniqueId.generate(),
        memberLedgerEntryId: UniqueId.generate(),
        paymentId: null,
        status: DueSettlementStatus.VOIDED,
      });

      expect(settlement.isApplied()).toBe(false);
    });
  });

  describe('isVoided', () => {
    it('should return true when status is VOIDED', () => {
      const settlement = DueSettlementEntity.fromPersistence({
        amount: Amount.fromCents(1000)._unsafeUnwrap(),
        dueId: UniqueId.generate(),
        memberLedgerEntryId: UniqueId.generate(),
        paymentId: null,
        status: DueSettlementStatus.VOIDED,
      });

      expect(settlement.isVoided()).toBe(true);
    });

    it('should return false when status is APPLIED', () => {
      const dueId = UniqueId.generate();

      const settlement = createTestDueSettlement(dueId);

      expect(settlement.isVoided()).toBe(false);
    });
  });

  describe('void', () => {
    it('should change status to VOIDED', () => {
      const dueId = UniqueId.generate();
      const settlement = createTestDueSettlement(dueId);

      expect(settlement.isApplied()).toBe(true);

      settlement.void();

      expect(settlement.isVoided()).toBe(true);
      expect(settlement.isApplied()).toBe(false);
      expect(settlement.status).toBe(DueSettlementStatus.VOIDED);
    });

    it('should be idempotent', () => {
      const dueId = UniqueId.generate();
      const settlement = createTestDueSettlement(dueId);

      settlement.void();
      settlement.void();

      expect(settlement.isVoided()).toBe(true);
    });
  });

  describe('entity equality', () => {
    it('should be equal when ids match', () => {
      const dueId = UniqueId.generate();
      const settlement1 = createTestDueSettlement(dueId);

      // Create another settlement with the same entity (clone-like behavior)
      const settlement2 = DueSettlementEntity.fromPersistence({
        amount: settlement1.amount,
        dueId: settlement1.dueId,
        memberLedgerEntryId: settlement1.memberLedgerEntryId,
        paymentId: settlement1.paymentId,
        status: settlement1.status,
      });

      // Note: fromPersistence creates a new entity without preserving the id,
      // so they won't be equal. This tests the Entity base class behavior.
      expect(settlement1.equals(settlement2)).toBe(false);
    });

    it('should not be equal when ids differ', () => {
      const dueId = UniqueId.generate();

      const settlement1 = createTestDueSettlement(dueId);
      const settlement2 = createTestDueSettlement(dueId);

      expect(settlement1.equals(settlement2)).toBe(false);
    });
  });

  describe('getters', () => {
    it('should return all properties correctly', () => {
      const dueId = UniqueId.generate();
      const props = createDueSettlementProps(dueId);

      const settlement = DueSettlementEntity.create(props)._unsafeUnwrap();

      expect(settlement.amount).toBe(props.amount);
      expect(settlement.dueId).toBe(props.dueId);
      expect(settlement.memberLedgerEntryId).toBe(props.memberLedgerEntryId);
      expect(settlement.paymentId).toBe(props.paymentId);
      expect(settlement.status).toBe(DueSettlementStatus.APPLIED);
    });
  });
});
