import { Inject, Injectable } from '@nestjs/common';

import type { DueEntity } from '@/dues/domain/entities/due.entity';
import type { MemberLedgerEntryEntity } from '@/members/ledger/domain/member-ledger-entry.entity';
import type { MovementEntity } from '@/movements/domain/entities/movement.entity';
import type { PaymentEntity } from '@/payments/domain/entities/payment.entity';
import type {
  TransactionalRepositories,
  UnitOfWork,
} from '@/shared/domain/unit-of-work';

import {
  DUE_REPOSITORY_PROVIDER,
  type DueRepository,
} from '@/dues/domain/due.repository';
import {
  MEMBER_LEDGER_REPOSITORY_PROVIDER,
  type MemberLedgerRepository,
} from '@/members/ledger/member-ledger.repository';
import {
  MOVEMENT_REPOSITORY_PROVIDER,
  type MovementRepository,
} from '@/movements/domain/movement.repository';
import {
  PAYMENT_REPOSITORY_PROVIDER,
  type PaymentRepository,
} from '@/payments/domain/payment.repository';
import { WriteableRepository } from '@/shared/domain/repository';

import type { PrismaTransactionClient } from './prisma.types';

import { PrismaService } from './prisma.service';

@Injectable()
export class PrismaUnitOfWork implements UnitOfWork {
  public constructor(
    private readonly prisma: PrismaService,
    @Inject(PAYMENT_REPOSITORY_PROVIDER)
    private readonly paymentRepository: PaymentRepository,
    @Inject(DUE_REPOSITORY_PROVIDER)
    private readonly dueRepository: DueRepository,
    @Inject(MEMBER_LEDGER_REPOSITORY_PROVIDER)
    private readonly memberLedgerRepository: MemberLedgerRepository,
    @Inject(MOVEMENT_REPOSITORY_PROVIDER)
    private readonly movementRepository: MovementRepository,
  ) {}

  public async execute<T>(
    fn: (repos: TransactionalRepositories) => Promise<T>,
  ): Promise<T> {
    return this.prisma.$transaction(async (tx) => {
      const repos: TransactionalRepositories = {
        duesRepository: this.createDueRepository(tx),
        memberLedgerRepository: this.createMemberLedgerRepository(tx),
        movementsRepository: this.createMovementRepository(tx),
        paymentsRepository: this.createPaymentRepository(tx),
      };

      return fn(repos);
    });
  }

  private createDueRepository(
    tx: PrismaTransactionClient,
  ): WriteableRepository<DueEntity> {
    return {
      save: (due: DueEntity): Promise<void> => this.dueRepository.save(due, tx),
    };
  }

  private createMemberLedgerRepository(
    tx: PrismaTransactionClient,
  ): WriteableRepository<MemberLedgerEntryEntity> {
    return {
      save: (ledgerEntry: MemberLedgerEntryEntity): Promise<void> =>
        this.memberLedgerRepository.save(ledgerEntry, tx),
    };
  }

  private createMovementRepository(
    tx: PrismaTransactionClient,
  ): WriteableRepository<MovementEntity> {
    return {
      save: (movement: MovementEntity): Promise<void> =>
        this.movementRepository.save(movement, tx),
    };
  }

  private createPaymentRepository(
    tx: PrismaTransactionClient,
  ): WriteableRepository<PaymentEntity> {
    return {
      save: (payment: PaymentEntity): Promise<void> =>
        this.paymentRepository.save(payment, tx),
    };
  }
}
