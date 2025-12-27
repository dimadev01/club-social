import { Module } from '@nestjs/common';

import { PrismaDueSettlementMapper } from '@/dues/infrastructure/prisma-due-settlement.mapper';
import { PrismaDueMapper } from '@/dues/infrastructure/prisma-due.mapper';
import { PrismaMemberLedgerEntryMapper } from '@/members/infrastructure/prisma-member-ledger.mapper';
import { PrismaMemberMapper } from '@/members/infrastructure/prisma-member.mapper';
import { PrismaMovementMapper } from '@/movements/infrastructure/prisma-movement.mapper';
import { PrismaPaymentMapper } from '@/payments/infrastructure/prisma-payment.mapper';
import { PrismaPricingMapper } from '@/pricing/infrastructure/prisma-pricing.mapper';
import { PrismaUserMapper } from '@/users/infrastructure/prisma-user.mapper';

import { PrismaMappers } from './prisma.mappers';
import { PrismaService } from './prisma.service';

@Module({
  exports: [PrismaMappers, PrismaService],
  imports: [],
  providers: [
    PrismaDueMapper,
    PrismaMemberMapper,
    PrismaMovementMapper,
    PrismaDueSettlementMapper,
    PrismaPaymentMapper,
    PrismaPricingMapper,
    PrismaMemberLedgerEntryMapper,
    PrismaUserMapper,
    PrismaMappers,
    PrismaService,
  ],
})
export class PrismaModule {}
