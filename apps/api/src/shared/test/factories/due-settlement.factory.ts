import { DueSettlementEntity } from '@/dues/domain/entities/due-settlement.entity';
import { Amount } from '@/shared/domain/value-objects/amount/amount.vo';
import { UniqueId } from '@/shared/domain/value-objects/unique-id/unique-id.vo';

import { TEST_DUE_SETTLEMENT_AMOUNT_CENTS } from '../constants';

export interface DueSettlementPropsOverrides {
  amount?: Amount;
  dueId?: UniqueId;
  memberLedgerEntryId?: UniqueId;
  paymentId?: null | UniqueId;
}

export const createDueSettlementProps = (
  dueId: UniqueId,
  overrides?: DueSettlementPropsOverrides,
) => ({
  amount: Amount.fromCents(TEST_DUE_SETTLEMENT_AMOUNT_CENTS)._unsafeUnwrap(),
  dueId,
  memberLedgerEntryId: UniqueId.generate(),
  paymentId: UniqueId.generate(),
  ...overrides,
});

export const createTestDueSettlement = (
  dueId: UniqueId,
  overrides?: DueSettlementPropsOverrides,
): DueSettlementEntity =>
  DueSettlementEntity.create(
    createDueSettlementProps(dueId, overrides),
  )._unsafeUnwrap();
