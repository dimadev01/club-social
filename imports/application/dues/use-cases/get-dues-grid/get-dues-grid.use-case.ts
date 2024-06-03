import { Result, ok } from 'neverthrow';
import invariant from 'tiny-invariant';
import { inject, injectable } from 'tsyringe';

import { DIToken } from '@application/common/di/tokens.di';
import { DueGridDto } from '@application/dues/dtos/due-grid.dto';
import { GetDuesGridRequest } from '@application/dues/use-cases/get-dues-grid/get-dues-grid.request';
import { GetDuesGridResponse } from '@application/dues/use-cases/get-dues-grid/get-dues-grid.response';
import { IUseCase } from '@domain/common/use-case.interface';
import { IDueRepository } from '@domain/dues/due.repository';
import { Due } from '@domain/dues/models/due.model';

@injectable()
export class GetDuesGridUseCase
  implements IUseCase<GetDuesGridRequest, GetDuesGridResponse>
{
  public constructor(
    @inject(DIToken.IDueRepository)
    private readonly _dueRepository: IDueRepository,
  ) {}

  public async execute(
    request: GetDuesGridRequest,
  ): Promise<Result<GetDuesGridResponse, Error>> {
    const { items, totalCount } =
      await this._dueRepository.findPaginated(request);

    return ok<GetDuesGridResponse>({
      items: items.map<DueGridDto>((due: Due) => {
        invariant(due.member);

        return {
          amount: due.amount.amount,
          category: due.category,
          date: due.date.toISOString(),
          id: due._id,
          isDeleted: due.isDeleted,
          memberId: due.memberId,
          memberName: due.member.name,
          notes: due.notes,
          status: due.status,
        };
      }),
      totalCount,
    });
  }
}
