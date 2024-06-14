import { Result, ok } from 'neverthrow';
import invariant from 'tiny-invariant';
import { inject, injectable } from 'tsyringe';

import { DIToken } from '@application/common/di/tokens.di';
import { DueGridDto } from '@application/dues/dtos/due-grid.dto';
import { DuePaymentDto } from '@application/dues/dtos/due-payment.dto';
import { MemberDtoMapper } from '@application/members/mappers/member-dto.mapper';
import { IUseCase } from '@domain/common/use-case.interface';
import {
  FindPaginatedDuesRequest,
  IDueRepository,
} from '@domain/dues/due.repository';

@injectable()
export class GetDuesToExportUseCase
  implements IUseCase<FindPaginatedDuesRequest, DueGridDto[]>
{
  public constructor(
    @inject(DIToken.IDueRepository)
    private readonly _dueRepository: IDueRepository,
    private readonly _memberDtoMapper: MemberDtoMapper,
  ) {}

  public async execute(
    request: FindPaginatedDuesRequest,
  ): Promise<Result<DueGridDto[], Error>> {
    const dues = await this._dueRepository.findToExport(request);

    return ok<DueGridDto[]>(
      dues.map<DueGridDto>((due) => {
        invariant(due.member);

        return {
          amount: due.amount.value,
          category: due.category,
          createdAt: due.createdAt.toISOString(),
          date: due.date.toISOString(),
          id: due._id,
          isPayable: due.isPayable(),
          member: this._memberDtoMapper.toDto(due.member),
          memberId: due.memberId,
          payments: due.payments.map<DuePaymentDto>((duePayment) => ({
            creditAmount: duePayment.creditAmount.value,
            directAmount: duePayment.directAmount.value,
            paymentDate: duePayment.paymentDate.toISOString(),
            paymentId: duePayment.paymentId,
            paymentReceiptNumber: duePayment.paymentReceiptNumber,
            paymentStatus: duePayment.paymentStatus,
            totalAmount: duePayment.totalAmount.value,
          })),
          status: due.status,
          totalPaidAmount: due.totalPaidAmount.value,
          totalPendingAmount: due.totalPendingAmount.value,
        };
      }),
    );
  }
}
