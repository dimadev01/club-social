import { Result, ok } from 'neverthrow';
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

    return ok<GetGridResponse<GetMemberGridResponse>>({
      items: items.map<GetMemberGridResponse>((item) => ({
        _id: item._id,
        category: item.category,
        name: item.name,
      })),
      totalCount,
    });

    //   const { count, items: data } = await this._memberRepository.findPaginated({
    //     ...request,
    //     findForCsv: false,
    //   });

    //   return ok<PaginatedResponse<MemberGridDto>>({
    //     count,
    //     data: data.map(
    //       (member: FindPaginatedMember): MemberGridDto => ({
    //         _id: member._id,
    //         category: member.category,
    //         electricityBalance: member.electricityBalance,
    //         emails: member.user.emails ?? null,
    //         guestBalance: member.guestBalance,
    //         membershipBalance: member.membershipBalance,
    //         name: `${member.user.profile?.lastName ?? ''} ${
    //           member.user.profile?.firstName ?? ''
    //         }`,
    //         status: member.status,
    //         totalBalance: member.totalBalance,
    //       }),
    //     ),
    //   });
  }
}
