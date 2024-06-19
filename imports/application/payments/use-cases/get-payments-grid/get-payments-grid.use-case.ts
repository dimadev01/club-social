import { Result, ok } from 'neverthrow';
import invariant from 'tiny-invariant';
import { inject, injectable } from 'tsyringe';

import { DIToken } from '@application/common/di/tokens.di';
import { FindPaginatedResponse } from '@application/common/repositories/grid.repository';
import { IUseCase } from '@application/common/use-case.interface';
import { MemberDtoMapper } from '@application/members/mappers/member-dto.mapper';
import { PaymentDueDto } from '@application/payments/dtos/payment-due.dto';
import { PaymentGridDto } from '@application/payments/dtos/payment-grid-dto';
import {
  FindPaginatedPaymentsRequest,
  IPaymentRepository,
} from '@application/payments/repositories/payment.repository';

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
  ) {}

  public async execute(
    request: FindPaginatedPaymentsRequest,
  ): Promise<Result<FindPaginatedResponse<PaymentGridDto>, Error>> {
    const { items, totalCount } =
      await this._paymentRepository.findPaginated(request);

    const dtos = items.map<PaymentGridDto>((payment) => {
      invariant(payment.member);

      return {
        amount: payment.amount.amount,
        createdAt: payment.createdAt.toISOString(),
        date: payment.date.toISOString(),
        dues: payment.dues.map<PaymentDueDto>((paymentDue) => ({
          creditAmount: paymentDue.creditAmount.amount,
          directAmount: paymentDue.directAmount.amount,
          dueAmount: paymentDue.dueAmount.amount,
          dueCategory: paymentDue.dueCategory,
          dueDate: paymentDue.dueDate.toISOString(),
          dueId: paymentDue.dueId,
          duePendingAmount: paymentDue.duePendingAmount.amount,
          source: paymentDue.source,
          totalAmount: paymentDue.totalAmount.amount,
        })),
        duesCount: payment.dues.length,
        id: payment._id,
        member: this._memberDtoMapper.toDto(payment.member),
        memberId: payment.memberId,
        receiptNumber: payment.receiptNumber,
        status: payment.status,
      };
    });

    return ok({ items: dtos, totalCount });
  }
}
