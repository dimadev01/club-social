import { Result, ok } from 'neverthrow';
import invariant from 'tiny-invariant';
import { inject, injectable } from 'tsyringe';

import { DIToken } from '@application/common/di/tokens.di';
import { MemberDtoMapper } from '@application/members/mappers/member-dto.mapper';
import { PaymentGridDto } from '@application/payments/dtos/payment-grid-dto';
import { PaymentDueDtoMapper } from '@application/payments/mappers/payment-due-dto.mapper';
import { FindPaginatedResponse } from '@domain/common/repositories/grid.repository';
import { IUseCase } from '@domain/common/use-case.interface';
import {
  FindPaginatedPaymentsRequest,
  IPaymentRepository,
} from '@domain/payments/payment.repository';

@injectable()
export class GetPaymentsGridUseCase
  implements
    IUseCase<
      FindPaginatedPaymentsRequest,
      FindPaginatedResponse<PaymentGridDto>
    >
{
  public constructor(
    @inject(DIToken.IPaymentRepository)
    private readonly _paymentRepository: IPaymentRepository,
    private readonly _memberDtoMapper: MemberDtoMapper,
    private readonly _paymentDueDtoMapper: PaymentDueDtoMapper,
  ) {}

  public async execute(
    request: FindPaginatedPaymentsRequest,
  ): Promise<Result<FindPaginatedResponse<PaymentGridDto>, Error>> {
    const { items, totalCount } =
      await this._paymentRepository.findPaginated(request);

    const dtos = items.map<PaymentGridDto>((payment) => {
      invariant(payment.member);

      invariant(payment.paymentDues);

      return {
        date: payment.date.toISOString(),
        id: payment._id,
        member: this._memberDtoMapper.toDto(payment.member),
        memberId: payment.memberId,
        paymentDues: payment.paymentDues.map((pd) =>
          this._paymentDueDtoMapper.toDto(pd),
        ),
        paymentDuesCount: payment.paymentDues?.length,
        receiptNumber: payment.receiptNumber,
        totalAmount: payment.getTotalAmountOfDues(),
      };
    });

    return ok({ items: dtos, totalCount });
  }
}
