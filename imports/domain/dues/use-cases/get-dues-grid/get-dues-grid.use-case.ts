import dayjs from 'dayjs';
import { ok, Result } from 'neverthrow';
import { inject, injectable } from 'tsyringe';
import { IUseCase } from '@application/use-cases/use-case.interface';
import { DueCategoryEnum } from '@domain/dues/due.enum';
import { IDuePort } from '@domain/dues/due.port';
import { Due } from '@domain/dues/entities/due.entity';
import { DueGridDto } from '@domain/dues/use-cases/get-dues-grid/get-dues-grid.dto';
import { GetDuesGridRequestDto } from '@domain/dues/use-cases/get-dues-grid/get-dues-grid.request.dto';
import { GetDuesGridResponseDto } from '@domain/dues/use-cases/get-dues-grid/get-dues-grid.response.dto';
import { DIToken } from '@infra/di/di-tokens';
import { UseCase } from '@infra/use-cases/use-case';

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
    const { data, count } = await this._duePort.findPaginated(request);

    return ok<GetDuesGridResponseDto>({
      count,
      data: data.map(
        (due: Due): DueGridDto => ({
          _id: due._id,
          amount: due.amountFormatted,
          category: due.category,
          date: due.dateFormatted,
          isDeleted: due.isDeleted,
          memberId: due.member._id,
          memberName: due.member.name,
          membershipMonth:
            due.category === DueCategoryEnum.Membership
              ? dayjs.utc(due.date).format('MMMM')
              : '-',
          status: due.status,
        })
      ),
    });
  }
}
