import { ok, Result } from 'neverthrow';
import { inject, injectable } from 'tsyringe';
import { IUseCase } from '@application/use-cases/use-case.interface';
import { IDuePort } from '@domain/dues/due.port';
import { Due } from '@domain/dues/entities/due.entity';
import { DueGridDto } from '@domain/dues/use-cases/get-dues-grid/due-grid.dto';
import { GetDuesGridRequestDto } from '@domain/dues/use-cases/get-dues-grid/get-dues-grid.request.dto';
import { GetDuesGridResponseDto } from '@domain/dues/use-cases/get-dues-grid/get-dues-grid.response.dto';
import { DIToken } from '@infra/di/di-tokens';
import { UseCase } from '@infra/use-cases/use-case';
import { MoneyUtils } from '@shared/utils/currency.utils';

@injectable()
export class GetDuesGridUseCase
  extends UseCase<GetDuesGridRequestDto>
  implements IUseCase<GetDuesGridRequestDto, GetDuesGridResponseDto>
{
  public constructor(
    @inject(DIToken.DueRepository)
    private readonly _duePort: IDuePort
  ) {
    super();
  }

  public async execute(
    request: GetDuesGridRequestDto
  ): Promise<Result<GetDuesGridResponseDto, Error>> {
    const { data, count, totalDues, totalPayments, balance } =
      await this._duePort.findPaginated(request);

    return ok<GetDuesGridResponseDto>({
      balance: MoneyUtils.formatCents(balance),
      count,
      data: data.map(
        (due: Due): DueGridDto => ({
          _id: due._id,
          amount: due.amountFormatted,
          category: due.category,
          date: due.dateFormatted,
          isDeleted: due.isDeleted,
          isPaid: due.isPaid(),
          isPartiallyPaid: due.isPartiallyPaid(),
          isPending: due.isPending(),
          memberId: due.member._id,
          memberName: due.member.name,
          membershipMonth: due.membershipMonth,
          paidAmount: due.payment?.amountFormatted ?? '-',
          paidAt: due.payment?.dateFormatted ?? '-',
          status: due.status,
        })
      ),
      totalDues: MoneyUtils.formatCents(totalDues),
      totalPayments: MoneyUtils.formatCents(totalPayments),
    });
  }
}
