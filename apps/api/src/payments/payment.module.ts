import { Module } from '@nestjs/common';

import { DuesModule } from '@/dues/due.module';

import { CreatePaymentUseCase } from './application/create-payment/create-payment.use-case';
import { UpdatePaymentUseCase } from './application/update-payment/update-payment.use-case';
import { PAYMENT_REPOSITORY_PROVIDER } from './domain/payment.repository';
import { PrismaPaymentMapper } from './infrastructure/prisma-payment.mapper';
import { PrismaPaymentRepository } from './infrastructure/prisma-payment.repository';
import { PaymentsController } from './presentation/payment.controller';

@Module({
  controllers: [PaymentsController],
  exports: [PAYMENT_REPOSITORY_PROVIDER, PrismaPaymentMapper],
  imports: [DuesModule],
  providers: [
    CreatePaymentUseCase,
    UpdatePaymentUseCase,
    {
      provide: PAYMENT_REPOSITORY_PROVIDER,
      useClass: PrismaPaymentRepository,
    },
    PrismaPaymentMapper,
  ],
})
export class PaymentsModule {}
