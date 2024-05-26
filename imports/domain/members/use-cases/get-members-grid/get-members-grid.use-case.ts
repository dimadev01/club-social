import { Result, ok } from 'neverthrow';
import { inject, injectable } from 'tsyringe';

import { IUseCase } from '@application/use-cases/use-case.interface';
import { IMemberPort } from '@domain/members/member.port';
import { GetMembersGridRequestDto } from '@domain/members/use-cases/get-members-grid/get-members-grid-request.dto';
import { MemberGridDto } from '@domain/members/use-cases/get-members-grid/get-members-grid.dto';
import { DIToken } from '@infra/di/di-tokens';
import { FindPaginatedMember } from '@infra/mongo/repositories/members/member-repository.types';
import { PaginatedResponse } from '@infra/pagination/paginated-response.dto';
import { UseCase } from '@infra/use-cases/use-case';

@injectable()
export class GetMembersGridUseCase
  extends UseCase<GetMembersGridRequestDto>
  implements
    IUseCase<GetMembersGridRequestDto, PaginatedResponse<MemberGridDto>>
{
  public constructor(
    @inject(DIToken.MemberRepository)
    private readonly _memberPort: IMemberPort,
  ) {
    super();
  }

  public async execute(
    request: GetMembersGridRequestDto,
  ): Promise<Result<PaginatedResponse<MemberGridDto>, Error>> {
    const { count, data } = await this._memberPort.findPaginated({
      ...request,
      findForCsv: false,
    });

    return ok<PaginatedResponse<MemberGridDto>>({
      count,
      data: data.map(
        (member: FindPaginatedMember): MemberGridDto => ({
          _id: member._id,
          category: member.category,
          electricityBalance: member.electricityBalance,
          emails: member.user.emails ?? null,
          guestBalance: member.guestBalance,
          membershipBalance: member.membershipBalance,
          name: `${member.user.profile?.lastName ?? ''} ${
            member.user.profile?.firstName ?? ''
          }`,
          status: member.status,
          totalBalance: member.totalBalance,
        }),
      ),
    });
  }
}
