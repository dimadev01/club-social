import { CreatePaymentRequestDto } from '@application/payments/use-cases/create-payment/create-payment-request.dto';
import { CreatePaymentUseCase } from '@application/payments/use-cases/create-payment/create-payment.use-case';
import { DeletePaymentUseCase } from '@application/payments/use-cases/delete-payment/delete-payment.use-case';
import type { ClientSession } from 'mongodb';
import { injectable } from 'tsyringe';

import { GetOneModelRequestDto } from '@adapters/common/dtos/get-model-request.dto';
import { MeteorMethodEnum } from '@adapters/meteor/meteor-methods.enum';
import { GetPaymentUseCase } from '@application/payments/use-cases/get-payment.use-case';
import { MeteorMethod } from '@infra/meteor/common/meteor-methods.base';

@injectable()
export class PaymentMethod extends MeteorMethod {
  public constructor(
    private readonly _getPayment: GetPaymentUseCase,
    private readonly _createPayment: CreatePaymentUseCase<ClientSession>,
    private readonly _deletePayment: DeletePaymentUseCase,
  ) {
    super();
  }

  public register() {
    Meteor.methods({
      [MeteorMethodEnum.PaymentsGet]: (request: GetOneModelRequestDto) =>
        this.execute(this._getPayment, request, GetOneModelRequestDto),

      [MeteorMethodEnum.PaymentsCreate]: (request: CreatePaymentRequestDto) =>
        this.execute(this._createPayment, request, CreatePaymentRequestDto),

      [MeteorMethodEnum.PaymentsDelete]: (request: GetOneModelRequestDto) =>
        this.execute(this._deletePayment, request, GetOneModelRequestDto),
    });
  }
}
