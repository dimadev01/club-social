import { Result, ok } from 'neverthrow';
import { inject, injectable } from 'tsyringe';

import { IUseCase } from '@domain/common/use-case.interface';
import { IMemberRepository } from '@domain/members/member-repository.interface';
import { MemberModel } from '@domain/members/models/member.model';
import { CreateMemberRequest } from '@domain/members/use-cases/create-member-new/create-member.request';
import { CreateMemberResponse } from '@domain/members/use-cases/create-member-new/create-member.response';
import { DIToken } from '@infra/di/di-tokens';

@injectable()
export class CreateMemberNewUseCase
  implements IUseCase<CreateMemberRequest, CreateMemberResponse>
{
  public constructor(
    @inject(DIToken.IMemberRepository)
    private readonly _memberRepository: IMemberRepository,
  ) {}

  public async execute(
    request: CreateMemberRequest,
  ): Promise<Result<CreateMemberResponse, Error>> {
    const member = MemberModel.createOne({ userId: '123' });

    if (member.isErr()) {
      throw member.error;
    }

    await this._memberRepository.insertOne(member.value);

    return ok({ id: member.value._id });
  }
}
