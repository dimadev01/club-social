import { Result, ok } from 'neverthrow';
import { inject, injectable } from 'tsyringe';

import { DIToken } from '@application/common/di/tokens.di';
import { DueGridDto } from '@application/dues/dtos/due-grid.dto';
import { DueDtoMapper } from '@application/dues/mappers/due-dto.mapper';
import { FindPaginatedResponse } from '@domain/common/repositories/grid.repository';
import { IUseCase } from '@domain/common/use-case.interface';
import {
  FindPaginatedDuesRequest,
  IDueRepository,
} from '@domain/dues/due.repository';

@injectable()
export class GetDuesGridUseCase
  implements
    IUseCase<FindPaginatedDuesRequest, FindPaginatedResponse<DueGridDto>>
{
  public constructor(
    @inject(DIToken.IDueRepository)
    private readonly _dueRepository: IDueRepository,
    private readonly _dueDtoMapper: DueDtoMapper,
  ) {}

  public async execute(
    request: FindPaginatedDuesRequest,
  ): Promise<Result<FindPaginatedResponse<DueGridDto>, Error>> {
    const { items, totalCount } =
      await this._dueRepository.findPaginated(request);

    console.log(items);

    return ok({
      items: items.map<DueGridDto>((due) => this._dueDtoMapper.toDto(due)),
      totalCount,
    });
  }
}
