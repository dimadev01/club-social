import { Result, ok } from 'neverthrow';
import { inject, injectable } from 'tsyringe';

import { IUseCase } from '@application/use-cases/use-case.interface';
import { IDuePort } from '@domain/dues/due.port';
import { Due } from '@domain/dues/entities/due.entity';
import { PaidDueDto } from '@domain/dues/use-cases/get-paid-dues/get-paid-due.dto';
import { GetPaidDuesRequestDto } from '@domain/dues/use-cases/get-paid-dues/get-paid-dues.request.dto';
import { GetPaidDuesResponseDto } from '@domain/dues/use-cases/get-paid-dues/get-paid-dues.response.dto';
import { DIToken } from '@infra/di/di-tokens';
import { UseCase } from '@infra/use-cases/use-case';

@injectable()
export class GetPaidDuesUseCase
  extends UseCase<GetPaidDuesRequestDto>
  implements IUseCase<GetPaidDuesRequestDto, GetPaidDuesResponseDto>
{
  public constructor(
    @inject(DIToken.DueRepository)
    private readonly _duePort: IDuePort,
  ) {
    super();
  }

  public async execute(
    request: GetPaidDuesRequestDto,
  ): Promise<Result<GetPaidDuesResponseDto, Error>> {
    const dues = await this._duePort.findPaid({
      memberId: request.memberId,
    });

    return ok<GetPaidDuesResponseDto>({
      data: dues.map(
        (due: Due): PaidDueDto => ({
          _id: due._id,
          date: due.date,
        }),
      ),
    });
  }
}
