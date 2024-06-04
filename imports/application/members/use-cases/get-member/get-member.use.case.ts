import { Result, ok } from 'neverthrow';
import { inject, injectable } from 'tsyringe';

import { DIToken } from '@application/common/di/tokens.di';
import { GetMemberRequest } from '@application/members/use-cases/get-member/get-member.request';
import { GetMemberResponse } from '@application/members/use-cases/get-member/get-member.response';
import { IUseCase } from '@domain/common/use-case.interface';
import { IMemberRepository } from '@domain/members/member.repository';

@injectable()
export class GetMemberUseCase
  implements IUseCase<GetMemberRequest, GetMemberResponse>
{
  public constructor(
    @inject(DIToken.IMemberRepository)
    private readonly _memberRepository: IMemberRepository,
  ) {}

  public async execute(
    request: GetMemberRequest,
  ): Promise<Result<GetMemberResponse, Error>> {
    const member = await this._memberRepository.findOneById({
      fetchUser: true,
      id: request.id,
    });

    return ok(member);
  }
}
