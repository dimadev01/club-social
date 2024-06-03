import type { ClientSession } from 'mongodb';
import { inject, injectable } from 'tsyringe';

import { BaseController } from '@adapters/common/controllers/base.controller';
import { MeteorMethodEnum } from '@adapters/common/meteor/meteor-methods.enum';
import { CreatePaymentRequestDto } from '@adapters/dtos/create-payment-request.dto';
import { GetOneDtoByIdRequestDto } from '@adapters/dtos/get-one-dto-request.dto';
import { GetPaymentsGridRequestDto } from '@adapters/dtos/get-payments-grid-request.dto';
import { DIToken } from '@application/common/di/tokens.di';
import { CreatePaymentUseCase } from '@application/payments/use-cases/create-payment/create-payment.use-case';
import { DeletePaymentUseCase } from '@application/payments/use-cases/delete-payment/delete-payment.use-case';
import { GetPaymentUseCase } from '@application/payments/use-cases/get-payment/get-payment.use-case';
import { GetPaymentsGridUseCase } from '@application/payments/use-cases/get-payments-grid/get-payments-grid.use-case';
import { ILogger } from '@domain/common/logger/logger.interface';

@injectable()
export class PaymentController extends BaseController {
  public constructor(
    @inject(DIToken.Logger)
    protected readonly logger: ILogger,
    private readonly _getPaymentsGrid: GetPaymentsGridUseCase,
    private readonly _getPayment: GetPaymentUseCase,
    private readonly _createPayment: CreatePaymentUseCase<ClientSession>,
    private readonly _deletePayment: DeletePaymentUseCase,
  ) {
    super(logger);
  }

  public register(): void {
    Meteor.methods({
      [MeteorMethodEnum.PaymentsGetGrid]: (
        request: GetPaymentsGridRequestDto,
      ) =>
        this.execute({
          classType: GetPaymentsGridRequestDto,
          request,
          useCase: this._getPaymentsGrid,
        }),

      [MeteorMethodEnum.PaymentsCreate]: (request: CreatePaymentRequestDto) =>
        this.execute({
          classType: CreatePaymentRequestDto,
          request,
          useCase: this._createPayment,
        }),

      [MeteorMethodEnum.PaymentsGet]: (request: GetOneDtoByIdRequestDto) =>
        this.execute({
          classType: GetOneDtoByIdRequestDto,
          request,
          useCase: this._getPayment,
        }),

      [MeteorMethodEnum.PaymentsDelete]: (request: GetOneDtoByIdRequestDto) =>
        this.execute({
          classType: GetOneDtoByIdRequestDto,
          request,
          useCase: this._deletePayment,
        }),
    });
  }
}
