import { Result, ok } from 'neverthrow';
import { inject, injectable } from 'tsyringe';

import { DIToken } from '@application/common/di/tokens.di';
import { IUseCase } from '@application/common/use-case.interface';
import { DueDto } from '@application/dues/dtos/due.dto';
import { DueDtoMapper } from '@application/dues/mappers/due-dto.mapper';
import {
  FindPendingDues,
  IDueRepository,
} from '@application/dues/repositories/due.repository';

@injectable()
export class GetPendingDuesUseCase
  implements IUseCase<FindPendingDues, DueDto[]>
{
  public constructor(
    @inject(DIToken.IDueRepository)
    private readonly _dueRepository: IDueRepository,
    private readonly _dueDtoMapper: DueDtoMapper,
  ) {}

  public async execute(
    request: FindPendingDues,
  ): Promise<Result<DueDto[], Error>> {
    const dues = await this._dueRepository.findPending({
      memberId: request.memberId,
    });

    return ok(dues.map((due) => this._dueDtoMapper.toDto(due)));
  }
}
