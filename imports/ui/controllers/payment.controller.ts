import { inject, injectable } from 'tsyringe';

import { DIToken } from '@application/common/di/tokens.di';
import { ILoggerRepository } from '@application/common/logger/logger.interface';
import { FindPaginatedResponse } from '@application/common/repositories/grid.repository';
import { PaymentGridDto } from '@application/payments/dtos/payment-grid-dto';
import { PaymentDto } from '@application/payments/dtos/payment.dto';
import { GetPaymentsTotalsResponse } from '@application/payments/repositories/payment.repository';
import { CreatePaymentUseCase } from '@application/payments/use-cases/create-payment/create-payment.use-case';
import { GetPaymentUseCase } from '@application/payments/use-cases/get-payment/get-payment.use-case';
import { GetPaymentsGridUseCase } from '@application/payments/use-cases/get-payments-grid/get-payments-grid.use-case';
import { GetPaymentsTotalUseCase } from '@application/payments/use-cases/get-payments-totals/get-payments-totals.use-case';
import { VoidPaymentUseCase } from '@application/payments/use-cases/void-payment/void-payment.use-case';
import { BaseController } from '@ui/common/controllers/base.controller';
import { GetOneByIdRequestDto } from '@ui/common/dtos/get-one-dto-request.dto';
import { CreatePaymentRequestDto } from '@ui/dtos/create-payment-request.dto';
import { GetPaymentsGridRequestDto } from '@ui/dtos/get-payments-grid-request.dto';
import { GetPaymentsTotalsRequestDto } from '@ui/dtos/get-payments-totals-request.dto';
import { VoidPaymentRequestDto } from '@ui/dtos/void-payment-request.dto';

@injectable()
export class PaymentController extends BaseController {
  public constructor(
    @inject(DIToken.Logger)
    protected readonly logger: ILoggerRepository,
    private readonly _getGrid: GetPaymentsGridUseCase,
    private readonly _getOne: GetPaymentUseCase,
    private readonly _create: CreatePaymentUseCase,
    private readonly _void: VoidPaymentUseCase,
    private readonly _getTotals: GetPaymentsTotalUseCase,
  ) {
    super(logger);
  }

  public async create(request: CreatePaymentRequestDto): Promise<PaymentDto> {
    return this.execute({
      classType: CreatePaymentRequestDto,
      request,
      useCase: this._create,
    });
  }

  public async getGrid(
    request: GetPaymentsGridRequestDto,
  ): Promise<FindPaginatedResponse<PaymentGridDto>> {
    return this.execute({
      classType: GetPaymentsGridRequestDto,
      request,
      useCase: this._getGrid,
    });
  }

  public async getOne(
    request: GetOneByIdRequestDto,
  ): Promise<PaymentDto | null> {
    return this.execute({
      classType: GetOneByIdRequestDto,
      request,
      useCase: this._getOne,
    });
  }

  public async void(request: VoidPaymentRequestDto): Promise<void> {
    await this.execute({
      classType: VoidPaymentRequestDto,
      request,
      useCase: this._void,
    });
  }

  public async getTotals(
    request: GetPaymentsTotalsRequestDto,
  ): Promise<GetPaymentsTotalsResponse> {
    return this.execute({
      classType: GetPaymentsTotalsRequestDto,
      request,
      useCase: this._getTotals,
    });
  }
}
