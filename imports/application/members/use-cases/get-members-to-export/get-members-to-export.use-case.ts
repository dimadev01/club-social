import { Result, ok } from 'neverthrow';
import invariant from 'tiny-invariant';
import { inject, injectable } from 'tsyringe';

import { MemberGridModelDto } from '@application/members/use-cases/get-members-grid/member-grid-model-dto';
import { DIToken } from '@domain/common/tokens.di';
import { IUseCaseNewV } from '@domain/common/use-case.interface';
import { FindPaginatedMembersRequest } from '@domain/members/repositories/member-repository.types';
import { IMemberRepository } from '@domain/members/repositories/member.repository';

@injectable()
export class GetMembersToExportUseCase
  implements IUseCaseNewV<FindPaginatedMembersRequest, MemberGridModelDto[]>
{
  public constructor(
    @inject(DIToken.IMemberRepository)
    private readonly _memberRepository: IMemberRepository,
  ) {}

  public async execute(
    request: FindPaginatedMembersRequest,
  ): Promise<Result<MemberGridModelDto[], Error>> {
    const items = await this._memberRepository.findToExport(request);

    const balances = await this._memberRepository.getBalances(
      items.map((item) => item._id),
    );

    return ok<MemberGridModelDto[]>(
      items.map<MemberGridModelDto>((item) => {
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
