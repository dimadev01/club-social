import { inject, injectable } from 'tsyringe';
import { DIToken } from '@infra/di/di-tokens';
import { ok, Result } from 'neverthrow';
import { IUseCase } from '@application/use-cases/use-case.interface';
import { DueCategoryEnum } from '@domain/dues/due.enum';
import { IDuePort } from '@domain/dues/due.port';
import { UseCase } from '@infra/use-cases/use-case';
import { Due } from '@domain/dues/entities/due.entity';
import { PendingDueDto } from '@domain/dues/use-cases/get-pending-dues/get-pending-due.dto';
import { GetPendingDuesRequestDto } from '@domain/dues/use-cases/get-pending-dues/get-pending-dues.request.dto';
import { DateFormatEnum, DateUtils } from '@shared/utils/date.utils';

@injectable()
export class GetPendingDuesByMemberUseCase
  extends UseCase<GetPendingDuesRequestDto>
  implements IUseCase<GetPendingDuesRequestDto, PendingDueDto[]>
{
  public constructor(
    @inject(DIToken.DueRepository)
    private readonly _duePort: IDuePort,
  ) {
    super();
  }

  public async execute(
    request: GetPendingDuesRequestDto,
  ): Promise<Result<PendingDueDto[], Error>> {
    const dues = await this._duePort.findPendingByMember({
      memberId: request.memberId,
    });

    return ok<PendingDueDto[]>(
      dues.map((due: Due) => ({
        _id: due._id,
        amount: due.getPendingAmount(),
        category: due.category,
        date: DateUtils.formatUtc(due.date),
        memberId: due.memberId,
        memberName: '',
        membershipMonth:
          due.category === DueCategoryEnum.Membership
            ? DateUtils.formatUtc(due.date, DateFormatEnum.MMMM_YYYY)
            : '',
        status: due.status,
      })),
    );
  }
}
