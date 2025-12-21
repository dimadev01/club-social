import { DueCategory, DueStatus } from '@club-social/shared/dues';
import { PaymentDueStatus } from '@club-social/shared/payment-due';
import { Injectable } from '@nestjs/common';

import { Mapper } from '@/infrastructure/repositories/mapper';
import { PaymentDueEntity } from '@/payments/domain/entities/payment-due.entity';
import { PrismaPaymentDueMapper } from '@/payments/infrastructure/prisma-payment-due.mapper';
import { Amount } from '@/shared/domain/value-objects/amount/amount.vo';
import { DateOnly } from '@/shared/domain/value-objects/date-only/date-only.vo';
import { UniqueId } from '@/shared/domain/value-objects/unique-id/unique-id.vo';

import { DueEntity } from '../domain/entities/due.entity';
import { DueModelWithRelations } from './prisma-due.types';

@Injectable()
export class PrismaDueMapper extends Mapper<DueEntity, DueModelWithRelations> {
  public constructor(
    private readonly paymentDueMapper: PrismaPaymentDueMapper,
  ) {
    super();
  }

  public toDomain(due: DueModelWithRelations): DueEntity {
    return DueEntity.fromPersistence(
      {
        amount: Amount.raw({ cents: due.amount }),
        category: due.category as DueCategory,
        createdBy: due.createdBy,
        date: DateOnly.raw({ value: due.date }),
        memberId: UniqueId.raw({ value: due.memberId }),
        notes: due.notes,
        paymentDues: (due.paymentDues ?? []).map((pd) =>
          PaymentDueEntity.fromPersistence({
            amount: Amount.raw({ cents: pd.amount }),
            dueId: UniqueId.raw({ value: pd.dueId }),
            paymentId: UniqueId.raw({ value: pd.paymentId }),
            status: pd.status as PaymentDueStatus,
          }),
        ),
        status: due.status as DueStatus,
        voidedAt: due.voidedAt,
        voidedBy: due.voidedBy,
        voidReason: due.voidReason,
      },
      {
        createdAt: due.createdAt,
        createdBy: due.createdBy,
        deletedAt: due.deletedAt,
        deletedBy: due.deletedBy,
        id: UniqueId.raw({ value: due.id }),
        updatedAt: due.updatedAt,
        updatedBy: due.updatedBy,
      },
    );
  }

  public toPersistence(due: DueEntity): DueModelWithRelations {
    return {
      amount: due.amount.toCents(),
      category: due.category,
      createdAt: due.createdAt,
      createdBy: due.createdBy,
      date: due.date.value,
      deletedAt: due.deletedAt,
      deletedBy: due.deletedBy,
      id: due.id.value,
      memberId: due.memberId.value,
      notes: due.notes,
      paymentDues: due.paymentDues.map((pd) => ({
        amount: pd.amount.toCents(),
        dueId: pd.dueId.value,
        paymentId: pd.paymentId.value,
        status: pd.status,
      })),
      status: due.status,
      updatedAt: due.updatedAt,
      updatedBy: due.updatedBy,
      voidedAt: due.voidedAt,
      voidedBy: due.voidedBy,
      voidReason: due.voidReason,
    };
  }
}
