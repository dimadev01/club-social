import { Module } from '@nestjs/common';

import { CreatePaymentUseCase } from './application/create-payment.use-case';
import { VoidPaymentUseCase } from './application/void-payment.use-case';
import { PaymentsController } from './presentation/payment.controller';

@Module({
  controllers: [PaymentsController],

  providers: [CreatePaymentUseCase, VoidPaymentUseCase],
})
export class PaymentsModule {}
