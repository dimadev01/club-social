import { Result, ok } from 'neverthrow';
import { inject, injectable } from 'tsyringe';

import { IUseCase } from '@application/use-cases/use-case.interface';
import { IDuePort } from '@domain/dues/due.port';
import { GetDueRequestDto } from '@domain/dues/use-cases/get-due/get-due-request.dto';
import { GetDueResponseDto } from '@domain/dues/use-cases/get-due/get-due-response.dto';
import { DIToken } from '@infra/di/di-tokens';
import { UseCase } from '@infra/use-cases/use-case';

@injectable()
export class GetDueUseCase
  extends UseCase<GetDueRequestDto>
  implements IUseCase<GetDueRequestDto, GetDueResponseDto | null>
{
  public constructor(
    @inject(DIToken.DueRepository)
    private readonly _duePort: IDuePort,
  ) {
    super();
  }

  public async execute(
    request: GetDueRequestDto,
  ): Promise<Result<GetDueResponseDto | null, Error>> {
    const due = await this._duePort.findOneById(request.id);

    if (!due || due.isDeleted) {
      return ok(null);
    }

    return ok<GetDueResponseDto>({
      _id: due._id,
      amount: due.amount,
      amountFormatted: due.amountFormatted,
      category: due.category,
      date: due.dateFormatted,
      isPaid: due.isPaid(),
      isPartiallyPaid: due.isPartiallyPaid(),
      isPending: due.isPending(),
      memberId: due.memberId,
      memberName: '',
      notes: due.notes,
      status: due.status,
    });
  }
}
