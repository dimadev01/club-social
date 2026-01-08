import { Module } from '@nestjs/common';

import { DuesModule } from '@/dues/due.module';
import { MembersModule } from '@/members/member.module';

import { CreatePaymentUseCase } from './application/create-payment.use-case';
import { VoidPaymentUseCase } from './application/void-payment.use-case';
import { PaymentEventHandler } from './infrastructure/handlers/payment-event.handler';
import { PaymentsController } from './presentation/payment.controller';

@Module({
  controllers: [PaymentsController],
  exports: [VoidPaymentUseCase],
  imports: [DuesModule, MembersModule],
  providers: [CreatePaymentUseCase, VoidPaymentUseCase, PaymentEventHandler],
})
export class PaymentsModule {}
