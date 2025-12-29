import { Module } from '@nestjs/common';

import { DuesModule } from '@/dues/due.module';
import { MembersModule } from '@/members/member.module';

import { CreatePaymentUseCase } from './application/create-payment.use-case';
import { VoidPaymentUseCase } from './application/void-payment.use-case';
import { PAYMENT_REPOSITORY_PROVIDER } from './domain/payment.repository';
import { PrismaPaymentMapper } from './infrastructure/prisma-payment.mapper';
import { PrismaPaymentRepository } from './infrastructure/prisma-payment.repository';
import { PaymentsController } from './presentation/payment.controller';

@Module({
  controllers: [PaymentsController],
  exports: [PAYMENT_REPOSITORY_PROVIDER],
  imports: [DuesModule, MembersModule],
  providers: [
    CreatePaymentUseCase,
    VoidPaymentUseCase,
    PrismaPaymentMapper,
    {
      provide: PAYMENT_REPOSITORY_PROVIDER,
      useClass: PrismaPaymentRepository,
    },
  ],
})
export class PaymentsModule {}
