import { Result, err, ok } from 'neverthrow';
import { inject, injectable } from 'tsyringe';

import { DIToken } from '@application/common/di/tokens.di';
import { DueDto } from '@application/dues/dtos/due.dto';
import { DueDtoMapper } from '@application/dues/mappers/due-dto.mapper';
import { ModelNotFoundError } from '@domain/common/errors/model-not-found.error';
import { FindOneById } from '@domain/common/repositories/queryable.repository';
import { IUseCase } from '@domain/common/use-case.interface';
import { IDueRepository } from '@domain/dues/due.repository';

@injectable()
export class GetDueUseCase implements IUseCase<FindOneById, DueDto> {
  public constructor(
    @inject(DIToken.IDueRepository)
    private readonly _dueRepository: IDueRepository,
    private readonly _dueDtoMapper: DueDtoMapper,
  ) {}

  public async execute(request: FindOneById): Promise<Result<DueDto, Error>> {
    const due = await this._dueRepository.findOneById({
      fetchPaymentDues: true,
      id: request.id,
    });

    if (!due) {
      return err(new ModelNotFoundError());
    }

    return ok(this._dueDtoMapper.toDto(due));
  }
}
