import { inject, injectable } from 'tsyringe';

import { BaseController } from '@adapters/common/controllers/base.controller';
import { GetOneByIdRequestDto } from '@adapters/common/dtos/get-one-dto-request.dto';
import { CreatePaymentRequestDto } from '@adapters/dtos/create-payment-request.dto';
import { GetPaymentsGridRequestDto } from '@adapters/dtos/get-payments-grid-request.dto';
import { DIToken } from '@application/common/di/tokens.di';
import { PaymentGridDto } from '@application/payments/dtos/payment-grid-dto';
import { PaymentDto } from '@application/payments/dtos/payment.dto';
import { CreatePaymentUseCase } from '@application/payments/use-cases/create-payment/create-payment.use-case';
import { DeletePaymentUseCase } from '@application/payments/use-cases/delete-payment/delete-payment.use-case';
import { GetPaymentUseCase } from '@application/payments/use-cases/get-payment/get-payment.use-case';
import { GetPaymentsGridUseCase } from '@application/payments/use-cases/get-payments-grid/get-payments-grid.use-case';
import { ILogger } from '@domain/common/logger/logger.interface';
import { FindPaginatedResponse } from '@domain/common/repositories/grid.repository';

@injectable()
export class PaymentController extends BaseController {
  public constructor(
    @inject(DIToken.Logger)
    protected readonly logger: ILogger,
    private readonly _getGrid: GetPaymentsGridUseCase,
    private readonly _getOne: GetPaymentUseCase,
    private readonly _create: CreatePaymentUseCase,
    private readonly _delete: DeletePaymentUseCase,
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

  public async delete(request: GetOneByIdRequestDto): Promise<void> {
    await this.execute({
      classType: GetOneByIdRequestDto,
      request,
      useCase: this._delete,
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
}
