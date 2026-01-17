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

    it('should fail to create a settlement with negative amount', () => {
      const props = {
        ...createDueSettlementProps(UniqueId.generate()),
        amount: Amount.raw({ cents: -5000 }),
      };

      const result = DueSettlementEntity.create(props);

      expect(result.isErr()).toBe(true);
      expect(result._unsafeUnwrapErr().message).toBe(
        'El monto del settlement debe ser positivo',
      );
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
    it('should reflect status helpers for each status', () => {
      const cases = [
        {
          expected: { isApplied: true, isVoided: false },
          status: DueSettlementStatus.APPLIED,
        },
        {
          expected: { isApplied: false, isVoided: true },
          status: DueSettlementStatus.VOIDED,
        },
      ];

      cases.forEach(({ expected, status }) => {
        const settlement =
          status === DueSettlementStatus.APPLIED
            ? createTestDueSettlement(UniqueId.generate())
            : DueSettlementEntity.fromPersistence({
                amount: Amount.fromCents(1000)._unsafeUnwrap(),
                dueId: UniqueId.generate(),
                memberLedgerEntryId: UniqueId.generate(),
                paymentId: null,
                status,
              });

        expect(settlement.isApplied()).toBe(expected.isApplied);
        expect(settlement.isVoided()).toBe(expected.isVoided);
      });
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
});
