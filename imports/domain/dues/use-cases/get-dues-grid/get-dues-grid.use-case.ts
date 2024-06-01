import { Result, ok } from 'neverthrow';
import { inject, injectable } from 'tsyringe';

import { IUseCaseOld } from '@application/use-cases/use-case.interface';
import { DIToken } from '@domain/common/tokens.di';
import { IDuePort } from '@domain/dues/due.port';
import { Due } from '@domain/dues/entities/due.entity';
import { DueGridDto } from '@domain/dues/use-cases/get-dues-grid/due-grid.dto';
import { GetDuesGridRequestDto } from '@domain/dues/use-cases/get-dues-grid/get-dues-grid.request.dto';
import { GetDuesGridResponseDto } from '@domain/dues/use-cases/get-dues-grid/get-dues-grid.response.dto';
import { UseCaseOld } from '@infra/use-cases/use-case';
import { MoneyUtils } from '@shared/utils/money.utils';

@injectable()
export class GetDuesGridUseCase
  extends UseCaseOld<GetDuesGridRequestDto>
  implements IUseCaseOld<GetDuesGridRequestDto, GetDuesGridResponseDto>
{
  public constructor(
    @inject(DIToken.DueRepository)
    private readonly _duePort: IDuePort,
  ) {
    super();
  }

  public async execute(
    request: GetDuesGridRequestDto,
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
          debtAmount: due.getAmountFormatted(),
          isDeleted: due.isDeleted,
          isPaid: due.isPaid(),
          isPartiallyPaid: due.isPartiallyPaid(),
          isPending: due.isPending(),
          memberId: due.memberId,
          memberName: '',
          membershipMonth: due.membershipMonth,
          paidAmount: '',
          payments: [],
          status: due.status,
        }),
      ),
      totalDues: MoneyUtils.formatCents(totalDues),
      totalPayments: MoneyUtils.formatCents(totalPayments),
    });
  }
}
