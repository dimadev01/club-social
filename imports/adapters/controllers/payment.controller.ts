import invariant from 'tiny-invariant';
import { inject, injectable } from 'tsyringe';

import { BaseController } from '@adapters/common/controllers/base.controller';
import { CreatePaymentRequestDto } from '@adapters/dtos/create-payment-request.dto';
import { GetOneDtoByIdRequestDto } from '@adapters/dtos/get-one-dto-request.dto';
import { GetPaymentsGridRequestDto } from '@adapters/dtos/get-payments-grid-request.dto';
import { DueDtoMapper } from '@adapters/mappers/due-dto.mapper';
import { MemberDtoMapper } from '@adapters/mappers/member-dto.mapper';
import { PaymentDtoMapper } from '@adapters/mappers/payment-dto.mapper';
import { PaymentDueDtoMapper } from '@adapters/mappers/payment-due-dto.mapper';
import { DIToken } from '@application/common/di/tokens.di';
import { GetDuesByIdsUseCase } from '@application/dues/use-cases/get-dues-by-ids/get-dues-by-ids.use-case';
import { PaymentGridDto } from '@application/payments/dtos/payment-grid-dto';
import { PaymentDto } from '@application/payments/dtos/payment.dto';
import { CreatePaymentUseCase } from '@application/payments/use-cases/create-payment/create-payment.use-case';
import { DeletePaymentUseCase } from '@application/payments/use-cases/delete-payment/delete-payment.use-case';
import { GetPaymentRequest } from '@application/payments/use-cases/get-payment/get-payment.request';
import { GetPaymentUseCase } from '@application/payments/use-cases/get-payment/get-payment.use-case';
import { GetPaymentsGridRequest } from '@application/payments/use-cases/get-payments-grid/get-payments-grid.request';
import { GetPaymentsGridResponse } from '@application/payments/use-cases/get-payments-grid/get-payments-grid.response';
import { GetPaymentsGridUseCase } from '@application/payments/use-cases/get-payments-grid/get-payments-grid.use-case';
import { ILogger } from '@domain/common/logger/logger.interface';

@injectable()
export class PaymentController extends BaseController {
  public constructor(
    @inject(DIToken.Logger)
    protected readonly logger: ILogger,
    private readonly _getPaymentsGrid: GetPaymentsGridUseCase,
    private readonly _getPayment: GetPaymentUseCase,
    private readonly _createPayment: CreatePaymentUseCase,
    private readonly _deletePayment: DeletePaymentUseCase,
    private readonly _getDuesByIdsUseCase: GetDuesByIdsUseCase,
    private readonly _memberDtoMapper: MemberDtoMapper,
    private readonly _dueDtoMapper: DueDtoMapper,
    private readonly _paymentDtoMapper: PaymentDtoMapper,
    private readonly _paymentDueDtoMapper: PaymentDueDtoMapper,
  ) {
    super(logger);
  }

  public async create(request: CreatePaymentRequestDto): Promise<PaymentDto> {
    const payment = await this.execute({
      classType: CreatePaymentRequestDto,
      request,
      useCase: this._createPayment,
    });

    return this._paymentDtoMapper.toDto(payment);
  }

  public async delete(request: GetOneDtoByIdRequestDto): Promise<void> {
    await this.execute({
      classType: GetOneDtoByIdRequestDto,
      request,
      useCase: this._deletePayment,
    });
  }

  public async getGrid(
    request: GetPaymentsGridRequest,
  ): Promise<GetPaymentsGridResponse<PaymentGridDto>> {
    const { items, totalCount } = await this.execute({
      classType: GetPaymentsGridRequestDto,
      request,
      useCase: this._getPaymentsGrid,
    });

    const dueIds = items
      .map((item) => {
        invariant(item.paymentDues);

        return item.paymentDues.map((due) => due.dueId);
      })
      .flat();

    const dues = await this.execute({
      request: { ids: dueIds },
      useCase: this._getDuesByIdsUseCase,
    });

    return {
      items: items.map<PaymentGridDto>((payment) => {
        invariant(payment.member);

        invariant(payment.paymentDues);

        return {
          date: payment.date.toISOString(),
          id: payment._id,
          isDeleted: payment.isDeleted,
          member: this._memberDtoMapper.toDto(payment.member),
          memberId: payment.memberId,
          paymentDues: payment.paymentDues.map((paymentDue) => {
            const due = dues.find((d) => d._id === paymentDue.dueId);

            invariant(due);

            const paymentDueDto = this._paymentDueDtoMapper.toDto(paymentDue);

            return {
              ...paymentDueDto,
              due: this._dueDtoMapper.toDto(due),
            };
          }),
          paymentDuesCount: payment.paymentDues?.length ?? 0,
          receiptNumber: payment.receiptNumber,
          totalAmount: payment.getTotalAmountOfDues(),
        };
      }),
      totalCount,
    };
  }

  public async getOne(request: GetPaymentRequest): Promise<PaymentDto | null> {
    const payment = await this.execute({
      classType: GetOneDtoByIdRequestDto,
      request,
      useCase: this._getPayment,
    });

    if (!payment) {
      return null;
    }

    return this._paymentDtoMapper.toDto(payment);
  }
}
