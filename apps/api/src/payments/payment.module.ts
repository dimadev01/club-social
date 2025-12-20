import { Module } from '@nestjs/common';

import { DuesModule } from '@/dues/due.module';

import { CreatePaymentUseCase } from './application/create-payment/create-payment.use-case';
import { VoidPaymentUseCase } from './application/void-payment/void-payment.use-case';
import { PAYMENT_REPOSITORY_PROVIDER } from './domain/payment.repository';
import { PrismaPaymentRepository } from './infrastructure/prisma-payment.repository';
import { PaymentsController } from './presentation/payment.controller';

@Module({
  controllers: [PaymentsController],
  exports: [PAYMENT_REPOSITORY_PROVIDER],
  imports: [DuesModule],
  providers: [
    CreatePaymentUseCase,
    VoidPaymentUseCase,
    {
      provide: PAYMENT_REPOSITORY_PROVIDER,
      useClass: PrismaPaymentRepository,
    },
  ],
})
export class PaymentsModule {}
