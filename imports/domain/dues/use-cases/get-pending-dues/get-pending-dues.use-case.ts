import { ok, Result } from 'neverthrow';
import { inject, injectable } from 'tsyringe';
import { IUseCase } from '@application/use-cases/use-case.interface';
import { DueCategoryEnum } from '@domain/dues/due.enum';
import { IDuePort } from '@domain/dues/due.port';
import { Due } from '@domain/dues/entities/due.entity';
import { PendingDueDto } from '@domain/dues/use-cases/get-pending-dues/get-pending-due.dto';
import { GetPendingDuesRequestDto } from '@domain/dues/use-cases/get-pending-dues/get-pending-dues.request.dto';
import { DIToken } from '@infra/di/di-tokens';
import { UseCase } from '@infra/use-cases/use-case';
import { DateUtils } from '@shared/utils/date.utils';

@injectable()
export class GetPendingDuesUseCase
  extends UseCase<GetPendingDuesRequestDto>
  implements IUseCase<GetPendingDuesRequestDto, PendingDueDto[]>
{
  public constructor(
    @inject(DIToken.DueRepository)
    private readonly _duePort: IDuePort
  ) {
    super();
  }

  public async execute(
    request: GetPendingDuesRequestDto
  ): Promise<Result<PendingDueDto[], Error>> {
    const dues = await this._duePort.findPending({
      memberIds: request.memberIds,
    });

    return ok<PendingDueDto[]>(
      dues.map((due: Due) => ({
        _id: due._id,
        amount: due.amount,
        category: due.category,
        date: due.date.toISOString(),
        memberId: due.member._id,
        memberName: due.member.name,
        membershipMonth:
          due.category === DueCategoryEnum.Membership
            ? DateUtils.utc(due.date).format('MMMM')
            : '',
      }))
    );
  }
}
