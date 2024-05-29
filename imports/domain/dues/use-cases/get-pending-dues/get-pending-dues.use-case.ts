import { Result, ok } from 'neverthrow';
import { inject, injectable } from 'tsyringe';

import { IUseCaseOld } from '@application/use-cases/use-case.interface';
import { DIToken } from '@domain/common/tokens.di';
import { DueCategoryEnum } from '@domain/dues/due.enum';
import { IDuePort } from '@domain/dues/due.port';
import { Due } from '@domain/dues/entities/due.entity';
import { GetPendingDueResponseDto } from '@domain/dues/use-cases/get-pending-dues/get-pending-due.dto';
import { GetPendingDuesRequestDto } from '@domain/dues/use-cases/get-pending-dues/get-pending-dues.request.dto';
import { UseCase } from '@infra/use-cases/use-case';
import { DateFormatEnum, DateUtils } from '@shared/utils/date.utils';

@injectable()
export class GetPendingDuesByMemberUseCase
  extends UseCase<GetPendingDuesRequestDto>
  implements IUseCaseOld<GetPendingDuesRequestDto, GetPendingDueResponseDto[]>
{
  public constructor(
    @inject(DIToken.DueRepository)
    private readonly _duePort: IDuePort,
  ) {
    super();
  }

  public async execute(
    request: GetPendingDuesRequestDto,
  ): Promise<Result<GetPendingDueResponseDto[], Error>> {
    const dues = await this._duePort.findPendingByMember({
      memberId: request.memberId,
    });

    const pendingDues = dues.map<GetPendingDueResponseDto>((due: Due) => ({
      _id: due._id,
      amount: due.amount,
      amountFormatted: due.getAmountFormatted(),
      category: due.category,
      date: DateUtils.formatUtc(due.date),
      memberId: due.memberId,
      membershipMonth:
        due.category === DueCategoryEnum.Membership
          ? DateUtils.formatUtc(due.date, DateFormatEnum.MMMM_YYYY)
          : '',
      status: due.status,
    }));

    return ok<GetPendingDueResponseDto[]>(pendingDues);
  }
}
