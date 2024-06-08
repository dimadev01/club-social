import { Result, ok } from 'neverthrow';
import { inject, injectable } from 'tsyringe';

import { DIToken } from '@application/common/di/tokens.di';
import { DueDto } from '@application/dues/dtos/due.dto';
import { DueDtoMapper } from '@application/dues/mappers/due-dto.mapper';
import { FindManyByIds } from '@domain/common/repositories/queryable.repository';
import { IUseCase } from '@domain/common/use-case.interface';
import { IDueRepository } from '@domain/dues/due.repository';

@injectable()
export class GetDuesByIdsUseCase implements IUseCase<FindManyByIds, DueDto[]> {
  public constructor(
    @inject(DIToken.IDueRepository)
    private readonly _dueRepository: IDueRepository,
    private readonly _dueDtoMapper: DueDtoMapper,
  ) {}

  public async execute(
    request: FindManyByIds,
  ): Promise<Result<DueDto[], Error>> {
    const dues = await this._dueRepository.findByIds(request);

    return ok(dues.map((due) => this._dueDtoMapper.toDto(due)));
  }
}
