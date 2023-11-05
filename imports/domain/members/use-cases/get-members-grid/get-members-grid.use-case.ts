import { ok, Result } from 'neverthrow';
import { inject, injectable } from 'tsyringe';
import { IUseCase } from '@application/use-cases/use-case.interface';
import { IMemberPort } from '@domain/members/member.port';
import { MemberGridDto } from '@domain/members/use-cases/get-members-grid/get-members-grid.dto';
import { DIToken } from '@infra/di/di-tokens';
import { PaginatedRequestDto } from '@infra/pagination/paginated-request.dto';
import { PaginatedResponse } from '@infra/pagination/paginated-response.dto';
import { UseCase } from '@infra/use-cases/use-case';

@injectable()
export class GetMembersGridUseCase
  extends UseCase<PaginatedRequestDto>
  implements IUseCase<PaginatedRequestDto, PaginatedResponse<MemberGridDto>>
{
  public constructor(
    @inject(DIToken.MemberRepository)
    private readonly _memberPort: IMemberPort
  ) {
    super();
  }

  public async execute(
    request: PaginatedRequestDto
  ): Promise<Result<PaginatedResponse<MemberGridDto>, Error>> {
    const { count, data } = await this._memberPort.findPaginated(request);

    return ok<PaginatedResponse<MemberGridDto>>({
      count,
      data: data.map(
        (member): MemberGridDto => ({
          _id: member._id,
          category: member.category,
          electricityBalance: member.electricityBalance,
          emails: member.user.emails ?? null,
          guestBalance: member.guestBalance,
          membershipBalance: member.membershipBalance,
          // @ts-expect-error
          name: `${member.user.profile?.lastName ?? ''} ${
            // @ts-expect-error
            member.user.profile?.firstName ?? ''
          }`,
          status: member.status,
        })
      ),
    });
  }
}
