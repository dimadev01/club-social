import { Result, ok } from 'neverthrow';
import invariant from 'tiny-invariant';
import { inject, injectable } from 'tsyringe';

import { DIToken } from '@domain/common/tokens.di';
import { IUseCase } from '@domain/common/use-case.interface';
import {
  GetMembersGridRequest,
  IMemberRepository,
} from '@domain/members/member-repository.interface';
import { GetMemberGridResponse } from '@domain/members/use-cases/get-members-grid/get-member-grid.response';

@injectable()
export class GetMembersToExportUseCase
  implements IUseCase<GetMembersGridRequest, GetMemberGridResponse[]>
{
  public constructor(
    @inject(DIToken.IMemberRepository)
    private readonly _memberRepository: IMemberRepository,
  ) {}

  public async execute(
    request: GetMembersGridRequest,
  ): Promise<Result<GetMemberGridResponse[], Error>> {
    const items = await this._memberRepository.findToExport(request);

    const balances = await this._memberRepository.getBalances(
      items.map((item) => item._id),
    );

    return ok<GetMemberGridResponse[]>(
      items.map<GetMemberGridResponse>((item) => {
        const balance = balances.find((b) => b._id === item._id);

        invariant(balance);

        invariant(item.user);

        return {
          _id: item._id,
          category: item.category,
          name: item.user.name,
          pendingElectricity: balance.electricity,
          pendingGuest: balance.guest,
          pendingMembership: balance.membership,
          pendingTotal: balance.total,
          status: item.status,
        };
      }),
    );
  }
}
