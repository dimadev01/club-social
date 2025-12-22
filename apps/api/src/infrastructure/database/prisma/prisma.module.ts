import { Module } from '@nestjs/common';

import { PrismaDueMapper } from '@/dues/infrastructure/prisma-due.mapper';
import { PrismaMemberMapper } from '@/members/infrastructure/prisma-member.mapper';
import { PrismaMovementMapper } from '@/movements/infrastructure/prisma-movement.mapper';
import { PrismaPaymentDueMapper } from '@/payments/infrastructure/prisma-payment-due.mapper';
import { PrismaPaymentMapper } from '@/payments/infrastructure/prisma-payment.mapper';
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
    PrismaPaymentDueMapper,
    PrismaPaymentMapper,
    PrismaUserMapper,
    PrismaMappers,
    PrismaService,
  ],
})
export class PrismaModule {}
