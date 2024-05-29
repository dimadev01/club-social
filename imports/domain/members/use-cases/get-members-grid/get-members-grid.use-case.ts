import { Result, ok } from 'neverthrow';
import invariant from 'tiny-invariant';
import { inject, injectable } from 'tsyringe';

import { DIToken } from '@domain/common/tokens.di';
import { IUseCase } from '@domain/common/use-case.interface';
import { IMemberRepository } from '@domain/members/member-repository.interface';
import { GetMemberGridResponse } from '@domain/members/use-cases/get-member/get-member-grid.response';
import { GetGridRequestDto } from '@infra/controllers/types/get-grid-request.dto';
import { GetGridResponse } from '@infra/controllers/types/get-grid-response.dto';
import { UseCase } from '@infra/use-cases/use-case';

@injectable()
export class GetMembersGridUseCase
  extends UseCase<GetGridRequestDto>
  implements
    IUseCase<GetGridRequestDto, GetGridResponse<GetMemberGridResponse>>
{
  public constructor(
    @inject(DIToken.IMemberRepository)
    private readonly _memberRepository: IMemberRepository,
  ) {
    super();
  }

  public async execute(
    request: GetGridRequestDto,
  ): Promise<Result<GetGridResponse<GetMemberGridResponse>, Error>> {
    const { items, totalCount } = await this._memberRepository.findPaginated({
      filters: request.filters,
      limit: request.pageSize,
      page: request.page,
      sorter: request.sorter,
    });

    const balances = await this._memberRepository.getBalances(
      items.map((item) => item._id),
    );

    return ok<GetGridResponse<GetMemberGridResponse>>({
      items: items.map<GetMemberGridResponse>((item) => {
        const balance = balances.find((b) => b._id === item._id);

        invariant(balance);

        return {
          _id: item._id,
          category: item.category,
          name: item.name,
          pendingElectricity: balance.electricity,
          pendingGuest: balance.guest,
          pendingMembership: balance.membership,
          pendingTotal: balance.total,
          status: item.status,
        };
      }),
      totalCount,
    });
  }
}
