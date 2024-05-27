import { Result, ok } from 'neverthrow';
import { inject, injectable } from 'tsyringe';

import { IUseCase } from '@application/use-cases/use-case.interface';
import { MemberModel } from '@domain/members/models/member.model';
import { DIToken } from '@infra/di/di-tokens';
import { IMemberRepository } from '@infra/mongo/repositories/members/member-repository.interface';

@injectable()
export class CreateMemberNewUseCase implements IUseCase<null, MemberModel> {
  public constructor(
    @inject(DIToken.IMemberRepository)
    private readonly _memberRepository: IMemberRepository,
  ) {}

  public async execute(): Promise<Result<MemberModel, Error>> {
    const member = MemberModel.createOne({ userId: '123' });

    if (member.isErr()) {
      throw member.error;
    }

    await this._memberRepository.insertOne(member.value);

    return ok(member.value);
  }
}
