import { Result, err, ok } from 'neverthrow';
import { inject, injectable } from 'tsyringe';

import { DIToken } from '@application/common/di/tokens.di';
import { PaymentDto } from '@application/payments/dtos/payment.dto';
import { PaymentDtoMapper } from '@application/payments/mappers/payment-dto.mapper';
import { ModelNotFoundError } from '@domain/common/errors/model-not-found.error';
import { FindOneById } from '@domain/common/repositories/queryable.repository';
import { IUseCase } from '@domain/common/use-case.interface';
import { IPaymentRepository } from '@domain/payments/payment.repository';

@injectable()
export class GetPaymentUseCase implements IUseCase<FindOneById, PaymentDto> {
  public constructor(
    @inject(DIToken.IPaymentRepository)
    private readonly _paymentRepository: IPaymentRepository,
    private readonly _paymentDtoMapper: PaymentDtoMapper,
  ) {}

  public async execute(
    request: FindOneById,
  ): Promise<Result<PaymentDto, Error>> {
    const payment = await this._paymentRepository.findOneById({
      fetchMember: true,
      fetchPaymentDues: true,
      id: request.id,
    });

    if (!payment) {
      return err(new ModelNotFoundError());
    }

    return ok(this._paymentDtoMapper.toDto(payment));
  }
}
