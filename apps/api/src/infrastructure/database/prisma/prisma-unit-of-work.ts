import { Inject, Injectable } from '@nestjs/common';

import type { DueEntity } from '@/dues/domain/entities/due.entity';
import type { MemberLedgerEntryEntity } from '@/members/ledger/domain/member-ledger-entry.entity';
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
  PAYMENT_REPOSITORY_PROVIDER,
  type PaymentRepository,
} from '@/payments/domain/payment.repository';

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
  ) {}

  public async execute<T>(
    fn: (repos: TransactionalRepositories) => Promise<T>,
  ): Promise<T> {
    return this.prisma.$transaction(async (tx) => {
      const repos: TransactionalRepositories = {
        dues: this.createDueRepository(tx),
        memberLedger: this.createMemberLedgerRepository(tx),
        payments: this.createPaymentRepository(tx),
      };

      return fn(repos);
    });
  }

  private createDueRepository(
    tx: PrismaTransactionClient,
  ): TransactionalRepositories['dues'] {
    return {
      save: async (due: DueEntity): Promise<void> => {
        await this.dueRepository.save(due, tx);
      },
    };
  }

  private createMemberLedgerRepository(
    tx: PrismaTransactionClient,
  ): TransactionalRepositories['memberLedger'] {
    return {
      save: async (ledgerEntry: MemberLedgerEntryEntity): Promise<void> => {
        await this.memberLedgerRepository.save(ledgerEntry, tx);
      },
    };
  }

  private createPaymentRepository(
    tx: PrismaTransactionClient,
  ): TransactionalRepositories['payments'] {
    return {
      save: async (payment: PaymentEntity): Promise<void> => {
        await this.paymentRepository.save(payment, tx);
      },
    };
  }
}
