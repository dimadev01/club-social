import { Result, ok } from 'neverthrow';
import invariant from 'tiny-invariant';
import { inject, injectable } from 'tsyringe';

import { DIToken } from '@application/common/di/tokens.di';
import { FindPaginatedResponse } from '@application/common/repositories/grid.repository';
import { IUseCase } from '@application/common/use-case.interface';
import { DueGridDto } from '@application/dues/dtos/due-grid.dto';
import { DuePaymentDto } from '@application/dues/dtos/due-payment.dto';
import {
  FindPaginatedDuesRequest,
  IDueRepository,
} from '@application/dues/repositories/due.repository';
import { MemberDtoMapper } from '@application/members/mappers/member-dto.mapper';

@injectable()
export class GetDuesGridUseCase
  implements
    IUseCase<FindPaginatedDuesRequest, FindPaginatedResponse<DueGridDto>>
{
  public constructor(
    @inject(DIToken.IDueRepository)
    private readonly _dueRepository: IDueRepository,
    private readonly _memberDtoMapper: MemberDtoMapper,
  ) {}

  public async execute(
    request: FindPaginatedDuesRequest,
  ): Promise<Result<FindPaginatedResponse<DueGridDto>, Error>> {
    const { items, totalCount } =
      await this._dueRepository.findPaginated(request);

    return ok({
      items: items.map<DueGridDto>((due) => {
        invariant(due.member);

        return {
          amount: due.amount.amount,
          category: due.category,
          createdAt: due.createdAt.toISOString(),
          date: due.date.toISOString(),
          id: due._id,
          isPayable: due.isPayable(),
          member: this._memberDtoMapper.toDto(due.member),
          memberId: due.memberId,
          payments: due.payments.map<DuePaymentDto>((duePayment) => ({
            creditAmount: duePayment.creditAmount.amount,
            directAmount: duePayment.directAmount.amount,
            paymentDate: duePayment.paymentDate.toISOString(),
            paymentId: duePayment.paymentId,
            paymentReceiptNumber: duePayment.paymentReceiptNumber,
            paymentStatus: duePayment.paymentStatus,
            totalAmount: duePayment.totalAmount.amount,
          })),
          status: due.status,
          totalPaidAmount: due.totalPaidAmount.amount,
          totalPendingAmount: due.totalPendingAmount.amount,
        };
      }),
      totalCount,
    });
  }
}
