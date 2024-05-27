import { Result, ok } from 'neverthrow';
import { inject, injectable } from 'tsyringe';

import { IUseCase } from '@application/use-cases/use-case.interface';
import { MemberModel } from '@domain/members/models/member.model';
import { DIToken } from '@infra/di/di-tokens';
import { IMemberRepository } from '@infra/mongo/repositories/members/member-repository.interface';
import { IUserRepository } from '@infra/mongo/repositories/users/user-repository.interface';

@injectable()
export class GetMemberNewUseCase implements IUseCase<null, MemberModel | null> {
  public constructor(
    @inject(DIToken.IMemberRepository)
    private readonly _memberRepository: IMemberRepository,
    @inject(DIToken.IUserRepository)
    private readonly _userRepository: IUserRepository,
  ) {}

  public async execute(): Promise<Result<MemberModel | null, Error>> {
    const member =
      await this._memberRepository.findOneById('JuZ65fC3sCi6JqdNH');

    if (!member) {
      return ok(null);
    }

    member.user = await this._userRepository.findOneByIdOrThrow('123');

    return ok(member);
  }
}
