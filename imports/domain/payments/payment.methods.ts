import type { ClientSession } from 'mongodb';
import { injectable } from 'tsyringe';

import { MeteorMethodEnum } from '@adapters/meteor/meteor-methods.enum';
import { CreatePaymentRequestDto } from '@application/payments/use-cases/create-payment/create-payment-request.dto';
import { CreatePaymentUseCase } from '@application/payments/use-cases/create-payment/create-payment.use-case';
import { DeletePaymentRequestDto } from '@application/payments/use-cases/delete-payment/delete-payment-request.dto';
import { DeletePaymentUseCase } from '@application/payments/use-cases/delete-payment/delete-payment.use-case';
import { GetPaymentUseCase } from '@application/payments/use-cases/get-payment/get-payment.use-case';
import { FindOneModelByIdRequest } from '@domain/common/repositories/queryable.repository';
import { GetPaidDuesRequestDto } from '@domain/dues/use-cases/get-paid-dues/get-paid-dues.request.dto';
import { GetPaidDuesUseCase } from '@domain/dues/use-cases/get-paid-dues/get-paid-dues.use-case';
import { MeteorMethod } from '@infra/meteor/common/meteor-methods.base';

@injectable()
export class PaymentMethod extends MeteorMethod {
  public constructor(
    private readonly _getPaidDues: GetPaidDuesUseCase,
    private readonly _getPayment: GetPaymentUseCase,
    private readonly _createPayment: CreatePaymentUseCase<ClientSession>,
    private readonly _deletePayment: DeletePaymentUseCase,
  ) {
    super();
  }

  public register() {
    Meteor.methods({
      [MeteorMethodEnum.PaymentsGetPaid]: (request: GetPaidDuesRequestDto) =>
        this.execute(this._getPaidDues, request, GetPaidDuesRequestDto),

      [MeteorMethodEnum.PaymentsGet]: (request: FindOneModelByIdRequest) =>
        this.execute(this._getPayment, request, FindOneByIdModelRequest),

      [MeteorMethodEnum.PaymentsCreate]: (request: CreatePaymentRequestDto) =>
        this.execute(this._createPayment, request, CreatePaymentRequestDto),

      [MeteorMethodEnum.PaymentsDelete]: (request: DeletePaymentRequestDto) =>
        this.execute(this._deletePayment, request, DeletePaymentRequestDto),
    });
  }
}
