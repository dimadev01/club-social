import { plainToInstance } from 'class-transformer';
import { Result, ok } from 'neverthrow';
import { inject, injectable } from 'tsyringe';

import { IUseCaseOld } from '@application/use-cases/use-case.interface';
import { IMemberPort } from '@domain/members/member.port';
import { MemberOld } from '@domain/members/models/member.old';
import { GetMembersDto } from '@domain/members/use-cases/get-members/get-members.dto';
import { PermissionEnum, ScopeEnum } from '@domain/roles/role.enum';
import { DIToken } from '@infra/di/di-tokens';
import { UseCase } from '@infra/use-cases/use-case';

@injectable()
export class GetMembersUseCase
  extends UseCase
  implements IUseCaseOld<null, GetMembersDto[]>
{
  public constructor(
    @inject(DIToken.MemberRepositoryOld)
    private readonly _memberPort: IMemberPort,
  ) {
    super();
  }

  public async execute(): Promise<Result<GetMembersDto[], Error>> {
    await this.validatePermission(ScopeEnum.Members, PermissionEnum.Read);

    const data = await this._memberPort.findAll();

    return ok<GetMembersDto[]>(
      data
        .map((member) => plainToInstance(MemberOld, member))
        .map((member) => ({
          _id: member._id,
          category: member.category,
          name: member.name,
          status: member.status,
        })),
    );
  }
}
