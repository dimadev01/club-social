import { injectable } from 'tsyringe';

import { GetNextPaymentReceiptNumberUseCase } from './use-cases/get-next-payment-receipt-number/get-next-payment-receipt-number.use-case';

import { GetDuesGridRequestDto } from '@domain/dues/use-cases/get-dues-grid/get-dues-grid.request.dto';
import { GetPaidDuesRequestDto } from '@domain/dues/use-cases/get-paid-dues/get-paid-dues.request.dto';
import { GetPaidDuesUseCase } from '@domain/dues/use-cases/get-paid-dues/get-paid-dues.use-case';
import { CreatePaymentRequestDto } from '@domain/payments/use-cases/create-payment/create-payment-request.dto';
import { CreatePaymentUseCase } from '@domain/payments/use-cases/create-payment/create-payment.use-case';
import { DeletePaymentRequestDto } from '@domain/payments/use-cases/delete-payment/delete-payment-request.dto';
import { DeletePaymentUseCase } from '@domain/payments/use-cases/delete-payment/delete-payment.use-case';
import { GetPaymentRequestDto } from '@domain/payments/use-cases/get-payment/get-payment-request.dto';
import { GetPaymentUseCase } from '@domain/payments/use-cases/get-payment/get-payment.use-case';
import { GetPaymentsGridUseCase } from '@domain/payments/use-cases/get-payments-grid/get-payments-grid.use-case';
import { MeteorMethod } from '@infra/meteor/common/meteor-methods.base';
import { MethodsEnum } from '@infra/meteor/common/meteor-methods.enum';

@injectable()
export class PaymentMethod extends MeteorMethod {
  public constructor(
    private readonly _getPaymentsGrid: GetPaymentsGridUseCase,
    private readonly _getPaidDues: GetPaidDuesUseCase,
    private readonly _getPayment: GetPaymentUseCase,
    private readonly _createPayment: CreatePaymentUseCase,
    private readonly _deletePayment: DeletePaymentUseCase,
    private readonly _getNextPaymentReceiptNumber: GetNextPaymentReceiptNumberUseCase,
  ) {
    super();
  }

  public register() {
    Meteor.methods({
      [MethodsEnum.PaymentsGetGrid]: (request: GetDuesGridRequestDto) =>
        this.execute(this._getPaymentsGrid, request, GetDuesGridRequestDto),

      [MethodsEnum.PaymentsGetPaid]: (request: GetPaidDuesRequestDto) =>
        this.execute(this._getPaidDues, request, GetPaidDuesRequestDto),

      [MethodsEnum.PaymentsGet]: (request: GetPaymentRequestDto) =>
        this.execute(this._getPayment, request, GetPaymentRequestDto),

      [MethodsEnum.PaymentsCreate]: (request: CreatePaymentRequestDto) =>
        this.execute(this._createPayment, request, CreatePaymentRequestDto),

      [MethodsEnum.PaymentsDelete]: (request: DeletePaymentRequestDto) =>
        this.execute(this._deletePayment, request, DeletePaymentRequestDto),

      [MethodsEnum.PaymentsGetNextReceiptNumber]: () =>
        this.execute(this._getNextPaymentReceiptNumber),
    });
  }
}
