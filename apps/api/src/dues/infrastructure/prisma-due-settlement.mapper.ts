import { DueSettlementStatus } from '@club-social/shared/dues';
import { Injectable } from '@nestjs/common';

import {
  DueSettlementCreateInput,
  DueSettlementModel,
  DueSettlementUpdateInput,
} from '@/infrastructure/database/prisma/generated/models';
import { Amount } from '@/shared/domain/value-objects/amount/amount.vo';
import { UniqueId } from '@/shared/domain/value-objects/unique-id/unique-id.vo';

import { DueSettlementEntity } from '../domain/entities/due-settlement.entity';
import { DueEntity } from '../domain/entities/due.entity';

@Injectable()
export class PrismaDueSettlementMapper {
  public toDomain(settlement: DueSettlementModel): DueSettlementEntity {
    return DueSettlementEntity.fromPersistence({
      amount: Amount.raw({ cents: settlement.amount }),
      dueId: UniqueId.raw({ value: settlement.dueId }),
      memberLedgerEntryId: UniqueId.raw({
        value: settlement.memberLedgerEntryId,
      }),
      paymentId: settlement.paymentId
        ? UniqueId.raw({ value: settlement.paymentId })
        : null,
      status: settlement.status as DueSettlementStatus,
    });
  }

  public toUpserts(due: DueEntity): {
    create: DueSettlementCreateInput;
    update: DueSettlementUpdateInput;
    where: {
      dueId_memberLedgerEntryId: { dueId: string; memberLedgerEntryId: string };
    };
  }[] {
    return due.settlements.map((settlement) => {
      return {
        create: {
          amount: settlement.amount.toCents(),
          due: { connect: { id: due.id.value } },
          id: settlement.id.value,
          memberLedgerEntry: {
            connect: { id: settlement.memberLedgerEntryId.value },
          },
          status: settlement.status,
          ...(settlement.paymentId
            ? { payment: { connect: { id: settlement.paymentId.value } } }
            : {}),
        },
        update: {
          amount: settlement.amount.toCents(),
          status: settlement.status,
          ...(settlement.paymentId
            ? { payment: { connect: { id: settlement.paymentId.value } } }
            : { payment: { disconnect: true } }),
        },
        where: {
          dueId_memberLedgerEntryId: {
            dueId: due.id.value,
            memberLedgerEntryId: settlement.memberLedgerEntryId.value,
          },
        },
      };
    });
  }
}
