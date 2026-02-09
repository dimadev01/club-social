import { Inject, Injectable } from '@nestjs/common';

import type { DueEntity } from '@/dues/domain/entities/due.entity';
import type { MemberLedgerEntryEntity } from '@/members/ledger/domain/entities/member-ledger-entry.entity';
import type { MovementEntity } from '@/movements/domain/entities/movement.entity';
import type { NotificationEntity } from '@/notifications/domain/entities/notification.entity';
import type { PaymentEntity } from '@/payments/domain/entities/payment.entity';
import type {
  TransactionalRepositories,
  UnitOfWork,
} from '@/shared/domain/unit-of-work';

import {
  DUE_REPOSITORY_PROVIDER,
  type DueRepository,
} from '@/dues/domain/due.repository';
import { GroupEntity } from '@/groups/domain/entities/group.entity';
import { GROUP_REPOSITORY_PROVIDER } from '@/groups/domain/group.repository';
import { type GroupRepository } from '@/groups/domain/group.repository';
import { MemberEntity } from '@/members/domain/entities/member.entity';
import {
  MEMBER_REPOSITORY_PROVIDER,
  type MemberRepository,
} from '@/members/domain/member.repository';
import {
  MEMBER_LEDGER_REPOSITORY_PROVIDER,
  type MemberLedgerRepository,
} from '@/members/ledger/member-ledger.repository';
import {
  MOVEMENT_REPOSITORY_PROVIDER,
  type MovementRepository,
} from '@/movements/domain/movement.repository';
import {
  EMAIL_SUPPRESSION_REPOSITORY_PROVIDER,
  type EmailSuppressionRepository,
} from '@/notifications/domain/email-suppression.repository';
import { EmailSuppressionEntity } from '@/notifications/domain/entities/email-suppression.entity';
import {
  NOTIFICATION_REPOSITORY_PROVIDER,
  type NotificationRepository,
} from '@/notifications/domain/notification.repository';
import {
  PAYMENT_REPOSITORY_PROVIDER,
  type PaymentRepository,
} from '@/payments/domain/payment.repository';
import { PricingEntity } from '@/pricing/domain/entities/pricing.entity';
import {
  PRICING_REPOSITORY_PROVIDER,
  type PricingRepository,
} from '@/pricing/domain/pricing.repository';
import { WriteableRepository } from '@/shared/domain/repository';
import { UserEntity } from '@/users/domain/entities/user.entity';
import {
  USER_REPOSITORY_PROVIDER,
  type UserRepository,
} from '@/users/domain/user.repository';

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
    @Inject(MEMBER_REPOSITORY_PROVIDER)
    private readonly memberRepository: MemberRepository,
    @Inject(USER_REPOSITORY_PROVIDER)
    private readonly userRepository: UserRepository,
    @Inject(PRICING_REPOSITORY_PROVIDER)
    private readonly pricingRepository: PricingRepository,
    @Inject(GROUP_REPOSITORY_PROVIDER)
    private readonly groupRepository: GroupRepository,
    @Inject(NOTIFICATION_REPOSITORY_PROVIDER)
    private readonly notificationRepository: NotificationRepository,
    @Inject(EMAIL_SUPPRESSION_REPOSITORY_PROVIDER)
    private readonly emailSuppressionRepository: EmailSuppressionRepository,
  ) {}

  public async execute<T>(
    fn: (repos: TransactionalRepositories) => Promise<T>,
  ): Promise<T> {
    return this.prisma.$transaction(async (tx) =>
      fn({
        duesRepository: this.createDueRepository(tx),
        emailSuppressionRepository: this.createEmailSuppressionRepository(tx),
        groupRepository: this.createGroupRepository(tx),
        memberLedgerRepository: this.createMemberLedgerRepository(tx),
        memberRepository: this.createMemberRepository(tx),
        movementRepository: this.createMovementRepository(tx),
        notificationRepository: this.createNotificationRepository(tx),
        paymentRepository: this.createPaymentRepository(tx),
        pricingRepository: this.createPricingRepository(tx),
        userRepository: this.createUserRepository(tx),
      }),
    );
  }

  private createDueRepository(
    tx: PrismaTransactionClient,
  ): WriteableRepository<DueEntity> {
    return {
      save: (due: DueEntity): Promise<void> => this.dueRepository.save(due, tx),
    };
  }

  private createEmailSuppressionRepository(
    tx: PrismaTransactionClient,
  ): WriteableRepository<EmailSuppressionEntity> {
    return {
      save: (suppression: EmailSuppressionEntity): Promise<void> =>
        this.emailSuppressionRepository.save(suppression, tx),
    };
  }

  private createGroupRepository(
    tx: PrismaTransactionClient,
  ): WriteableRepository<GroupEntity> {
    return {
      save: (group: GroupEntity): Promise<void> =>
        this.groupRepository.save(group, tx),
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

  private createMemberRepository(
    tx: PrismaTransactionClient,
  ): WriteableRepository<MemberEntity> {
    return {
      save: (member: MemberEntity): Promise<void> =>
        this.memberRepository.save(member, tx),
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

  private createNotificationRepository(
    tx: PrismaTransactionClient,
  ): WriteableRepository<NotificationEntity> {
    return {
      save: (notification: NotificationEntity): Promise<void> =>
        this.notificationRepository.save(notification, tx),
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

  private createPricingRepository(
    tx: PrismaTransactionClient,
  ): WriteableRepository<PricingEntity> {
    return {
      save: (pricing: PricingEntity): Promise<void> =>
        this.pricingRepository.save(pricing, tx),
    };
  }

  private createUserRepository(
    tx: PrismaTransactionClient,
  ): WriteableRepository<UserEntity> {
    return {
      save: (user: UserEntity): Promise<void> =>
        this.userRepository.save(user, tx),
    };
  }
}
