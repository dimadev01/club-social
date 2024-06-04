import { Result, ok } from 'neverthrow';
import { inject, injectable } from 'tsyringe';

import { DIToken } from '@application/common/di/tokens.di';
import { GetMembersRequest } from '@application/members/use-cases/get-members/get-members.request';
import { GetMembersResponse } from '@application/members/use-cases/get-members/get-members.response';
import { IUseCase } from '@domain/common/use-case.interface';
import { IMemberRepository } from '@domain/members/repositories/member.repository';

@injectable()
export class GetMembersUseCase
  implements IUseCase<GetMembersRequest, GetMembersResponse>
{
  public constructor(
    @inject(DIToken.IMemberRepository)
    private readonly _memberRepository: IMemberRepository,
  ) {}

  public async execute(
    request: GetMembersRequest,
  ): Promise<Result<GetMembersResponse, Error>> {
    const members = await this._memberRepository.find({
      category: request.category,
      status: request.status,
    });

    return ok(members);
  }
}
