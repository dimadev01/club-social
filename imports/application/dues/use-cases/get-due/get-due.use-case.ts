import { Result, err, ok } from 'neverthrow';
import { inject, injectable } from 'tsyringe';

import { DIToken } from '@application/common/di/tokens.di';
import { FindOneById } from '@application/common/repositories/queryable.repository';
import { IUseCase } from '@application/common/use-case.interface';
import { DueDto } from '@application/dues/dtos/due.dto';
import { DueDtoMapper } from '@application/dues/mappers/due-dto.mapper';
import { IDueRepository } from '@application/dues/repositories/due.repository';
import { ModelNotFoundError } from '@domain/common/errors/model-not-found.error';

@injectable()
export class GetDueUseCase implements IUseCase<FindOneById, DueDto> {
  public constructor(
    @inject(DIToken.IDueRepository)
    private readonly _dueRepository: IDueRepository,
    private readonly _dueDtoMapper: DueDtoMapper,
  ) {}

  public async execute(request: FindOneById): Promise<Result<DueDto, Error>> {
    const due = await this._dueRepository.findOneById(request);

    if (!due) {
      return err(new ModelNotFoundError());
    }

    return ok(this._dueDtoMapper.toDto(due));
  }
}
