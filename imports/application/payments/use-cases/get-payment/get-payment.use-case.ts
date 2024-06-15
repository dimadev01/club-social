import { Result, err, ok } from 'neverthrow';
import { inject, injectable } from 'tsyringe';

import { DIToken } from '@application/common/di/tokens.di';
import { FindOneById } from '@application/common/repositories/queryable.repository';
import { IUseCase } from '@application/common/use-case.interface';
import { PaymentDto } from '@application/payments/dtos/payment.dto';
import { PaymentDtoMapper } from '@application/payments/mappers/payment-dto.mapper';
import { IPaymentRepository } from '@application/payments/repositories/payment.repository';
import { ModelNotFoundError } from '@domain/common/errors/model-not-found.error';

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
    const payment = await this._paymentRepository.findOneById(request);

    if (!payment) {
      return err(new ModelNotFoundError());
    }

    return ok(this._paymentDtoMapper.toDto(payment));
  }
}
