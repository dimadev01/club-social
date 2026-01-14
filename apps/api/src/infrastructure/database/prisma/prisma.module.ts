import { Module } from '@nestjs/common';

import { APP_SETTING_REPOSITORY_PROVIDER } from '@/app-settings/domain/app-setting.repository';
import { PrismaAppSettingMapper } from '@/app-settings/infrastructure/prisma-app-setting.mapper';
import { PrismaAppSettingRepository } from '@/app-settings/infrastructure/prisma-app-setting.repository';
import { AUDIT_LOG_REPOSITORY_PROVIDER } from '@/audit/domain/audit-log.repository';
import { PrismaAuditLogRepository } from '@/audit/infrastructure/prisma-audit-log.repository';
import { DUE_REPOSITORY_PROVIDER } from '@/dues/domain/due.repository';
import { PrismaDueSettlementMapper } from '@/dues/infrastructure/prisma-due-settlement.mapper';
import { PrismaDueMapper } from '@/dues/infrastructure/prisma-due.mapper';
import { PrismaDueRepository } from '@/dues/infrastructure/prisma-due.repository';
import { GROUP_REPOSITORY_PROVIDER } from '@/groups/domain/group.repository';
import { PrismaGroupMapper } from '@/groups/infrastructure/prisma-group.mapper';
import { PrismaGroupRepository } from '@/groups/infrastructure/prisma-group.repository';
import { MEMBER_REPOSITORY_PROVIDER } from '@/members/domain/member.repository';
import { PrismaMemberMapper } from '@/members/infrastructure/prisma-member.mapper';
import { PrismaMemberRepository } from '@/members/infrastructure/prisma-member.repository';
import { PrismaMemberLedgerEntryMapper } from '@/members/ledger/infrastructure/prisma-member-ledger.mapper';
import { PrismaMemberLedgerRepository } from '@/members/ledger/infrastructure/prisma-member-ledger.repository';
import { MEMBER_LEDGER_REPOSITORY_PROVIDER } from '@/members/ledger/member-ledger.repository';
import { MOVEMENT_REPOSITORY_PROVIDER } from '@/movements/domain/movement.repository';
import { PrismaMovementMapper } from '@/movements/infrastructure/prisma-movement.mapper';
import { PrismaMovementRepository } from '@/movements/infrastructure/prisma-movement.repository';
import { PAYMENT_REPOSITORY_PROVIDER } from '@/payments/domain/payment.repository';
import { PrismaPaymentMapper } from '@/payments/infrastructure/prisma-payment.mapper';
import { PrismaPaymentRepository } from '@/payments/infrastructure/prisma-payment.repository';
import { PRICING_REPOSITORY_PROVIDER } from '@/pricing/domain/pricing.repository';
import { PrismaPricingMapper } from '@/pricing/infrastructure/prisma-pricing.mapper';
import { PrismaPricingRepository } from '@/pricing/infrastructure/prisma-pricing.repository';
import { UNIT_OF_WORK_PROVIDER } from '@/shared/domain/unit-of-work';
import { USER_REPOSITORY_PROVIDER } from '@/users/domain/user.repository';
import { PrismaUserMapper } from '@/users/infrastructure/prisma-user.mapper';
import { PrismaUserRepository } from '@/users/infrastructure/prisma-user.repository';

import { PrismaUnitOfWork } from './prisma-unit-of-work';
import { PrismaService } from './prisma.service';

@Module({
  exports: [
    PrismaService,

    UNIT_OF_WORK_PROVIDER,

    PAYMENT_REPOSITORY_PROVIDER,
    DUE_REPOSITORY_PROVIDER,
    MEMBER_REPOSITORY_PROVIDER,
    MEMBER_LEDGER_REPOSITORY_PROVIDER,
    MOVEMENT_REPOSITORY_PROVIDER,
    PRICING_REPOSITORY_PROVIDER,
    USER_REPOSITORY_PROVIDER,
    AUDIT_LOG_REPOSITORY_PROVIDER,
    APP_SETTING_REPOSITORY_PROVIDER,
    GROUP_REPOSITORY_PROVIDER,
  ],
  imports: [],
  providers: [
    PrismaService,

    PrismaPaymentMapper,
    PrismaDueMapper,
    PrismaGroupMapper,
    PrismaDueSettlementMapper,
    PrismaMemberMapper,
    PrismaUserMapper,
    PrismaPricingMapper,
    PrismaMovementMapper,
    PrismaMemberLedgerEntryMapper,
    PrismaAppSettingMapper,

    {
      provide: UNIT_OF_WORK_PROVIDER,
      useClass: PrismaUnitOfWork,
    },
    {
      provide: PAYMENT_REPOSITORY_PROVIDER,
      useClass: PrismaPaymentRepository,
    },
    {
      provide: DUE_REPOSITORY_PROVIDER,
      useClass: PrismaDueRepository,
    },
    {
      provide: MEMBER_REPOSITORY_PROVIDER,
      useClass: PrismaMemberRepository,
    },
    {
      provide: MEMBER_LEDGER_REPOSITORY_PROVIDER,
      useClass: PrismaMemberLedgerRepository,
    },
    {
      provide: GROUP_REPOSITORY_PROVIDER,
      useClass: PrismaGroupRepository,
    },
    {
      provide: PRICING_REPOSITORY_PROVIDER,
      useClass: PrismaPricingRepository,
    },
    {
      provide: MOVEMENT_REPOSITORY_PROVIDER,
      useClass: PrismaMovementRepository,
    },
    {
      provide: USER_REPOSITORY_PROVIDER,
      useClass: PrismaUserRepository,
    },
    {
      provide: AUDIT_LOG_REPOSITORY_PROVIDER,
      useClass: PrismaAuditLogRepository,
    },
    {
      provide: APP_SETTING_REPOSITORY_PROVIDER,
      useClass: PrismaAppSettingRepository,
    },
  ],
})
export class PrismaModule {}
