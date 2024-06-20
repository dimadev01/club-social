import { container } from 'tsyringe';

import { CreatePaymentUseCase } from '@application/payments/use-cases/create-payment/create-payment.use-case';
import { GetPaymentUseCase } from '@application/payments/use-cases/get-payment/get-payment.use-case';
import { GetPaymentsGridUseCase } from '@application/payments/use-cases/get-payments-grid/get-payments-grid.use-case';
import { GetPaymentsTotalUseCase } from '@application/payments/use-cases/get-payments-totals/get-payments-totals.use-case';
import { VoidPaymentUseCase } from '@application/payments/use-cases/void-payment/void-payment.use-case';
import { MeteorMethods } from '@infra/meteor/common/meteor-methods';
import { VoidPaymentMethodRequestDto } from '@infra/meteor/dtos/void-payment-method-request.dto';
import { GetOneByIdRequestDto } from '@ui/common/dtos/get-one-dto-request.dto';
import { MeteorMethodEnum } from '@ui/common/meteor/meteor-methods.enum';
import { CreatePaymentRequestDto } from '@ui/dtos/create-payment-request.dto';
import { GetPaymentsGridRequestDto } from '@ui/dtos/get-payments-grid-request.dto';
import { GetPaymentsTotalsRequestDto } from '@ui/dtos/get-payments-totals-request.dto';
import { VoidPaymentRequestDto } from '@ui/dtos/void-payment-request.dto';

export class PaymentMethods extends MeteorMethods {
  public register(): void {
    Meteor.methods({
      [MeteorMethodEnum.PaymentsGetOne]: (req: GetOneByIdRequestDto) =>
        this.execute(
          container.resolve(GetPaymentUseCase),
          GetOneByIdRequestDto,
          req,
        ),

      [MeteorMethodEnum.PaymentsGetGrid]: (req: GetPaymentsGridRequestDto) =>
        this.execute(
          container.resolve(GetPaymentsGridUseCase),
          GetPaymentsGridRequestDto,
          req,
        ),

      [MeteorMethodEnum.PaymentsCreate]: (req: CreatePaymentRequestDto) =>
        this.execute(
          container.resolve(CreatePaymentUseCase),
          CreatePaymentRequestDto,
          req,
        ),

      [MeteorMethodEnum.PaymentsGetTotals]: (
        req: GetPaymentsTotalsRequestDto,
      ) =>
        this.execute(
          container.resolve(GetPaymentsTotalUseCase),
          GetPaymentsTotalsRequestDto,
          req,
        ),

      [MeteorMethodEnum.PaymentsVoid]: (req: VoidPaymentMethodRequestDto) =>
        this.execute(
          container.resolve(VoidPaymentUseCase),
          VoidPaymentRequestDto,
          { ...req, voidedBy: this.getCurrentUserName() },
        ),
    });
  }
}
