import { Result, ok } from 'neverthrow';
import invariant from 'tiny-invariant';
import { inject, injectable } from 'tsyringe';

import { DIToken } from '@application/common/di/tokens.di';
import { DueGridDto } from '@application/dues/dtos/due-grid.dto';
import { MemberDtoMapper } from '@application/members/mappers/member-dto.mapper';
import { PaymentDueDtoMapper } from '@application/payments/mappers/payment-due-dto.mapper';
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
    private readonly _memberDtoMapper: MemberDtoMapper,
    private readonly _paymentDueDtoMapper: PaymentDueDtoMapper,
  ) {}

  public async execute(
    request: FindPaginatedDuesRequest,
  ): Promise<Result<FindPaginatedResponse<DueGridDto>, Error>> {
    const { items, totalCount } =
      await this._dueRepository.findPaginated(request);

    console.log(items);

    return ok({
      items: items.map<DueGridDto>((due) => {
        invariant(due.member);

        return {
          amount: due.amount.value,
          category: due.category,
          date: due.date.toISOString(),
          id: due._id,
          member: this._memberDtoMapper.toDto(due.member),
          memberId: due.memberId,
          pendingAmount: due.getPendingAmount().value,
          status: due.status,
        };
      }),
      totalCount,
    });
  }
}
