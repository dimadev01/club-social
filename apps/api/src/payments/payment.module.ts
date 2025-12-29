import { Module } from '@nestjs/common';

import { DuesModule } from '@/dues/due.module';
import { MembersModule } from '@/members/member.module';

import { CreatePaymentUseCase } from './application/create-payment.use-case';
import { VoidPaymentUseCase } from './application/void-payment.use-case';
import { PaymentsController } from './presentation/payment.controller';

@Module({
  controllers: [PaymentsController],
  exports: [],
  imports: [DuesModule, MembersModule],
  providers: [CreatePaymentUseCase, VoidPaymentUseCase],
})
export class PaymentsModule {}
