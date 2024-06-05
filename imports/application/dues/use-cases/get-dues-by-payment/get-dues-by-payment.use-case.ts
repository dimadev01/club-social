import { Result, ok } from 'neverthrow';
import { inject, injectable } from 'tsyringe';

import { DIToken } from '@application/common/di/tokens.di';
import { DueDto } from '@application/dues/dtos/due.dto';
import { DueDtoMapper } from '@application/dues/mappers/due-dto.mapper';
import { IUseCase } from '@domain/common/use-case.interface';
import { FindDuesByPayment, IDueRepository } from '@domain/dues/due.repository';

@injectable()
export class GetDuesByPaymentUseCase
  implements IUseCase<FindDuesByPayment, DueDto[]>
{
  public constructor(
    @inject(DIToken.IDueRepository)
    private readonly _dueRepository: IDueRepository,
    private readonly _dueDtoMapper: DueDtoMapper,
  ) {}

  public async execute(
    request: FindDuesByPayment,
  ): Promise<Result<DueDto[], Error>> {
    const dues = await this._dueRepository.findByPayment(request);

    return ok(dues.map((due) => this._dueDtoMapper.toDto(due)));
  }
}
