import { plainToInstance } from 'class-transformer';
import { ok, Result } from 'neverthrow';
import { inject, injectable } from 'tsyringe';
import { IUseCase } from '@application/use-cases/use-case.interface';
import { Member } from '@domain/members/entities/member.entity';
import { IMemberPort } from '@domain/members/member.port';
import { GetMembersDto } from '@domain/members/use-cases/get-members/get-members.dto';
import { PermissionEnum, ScopeEnum } from '@domain/roles/roles.enum';
import { DIToken } from '@infra/di/di-tokens';
import { UseCase } from '@infra/use-cases/use-case';

@injectable()
export class GetMembersUseCase
  extends UseCase
  implements IUseCase<null, GetMembersDto[]>
{
  public constructor(
    @inject(DIToken.MemberRepository)
    private readonly _memberPort: IMemberPort
  ) {
    super();
  }

  public async execute(): Promise<Result<GetMembersDto[], Error>> {
    await this.validatePermission(ScopeEnum.Members, PermissionEnum.Read);

    const data = await this._memberPort.findAll();

    return ok<GetMembersDto[]>(
      data
        .map((member) => plainToInstance(Member, member))
        .map((member) => ({
          _id: member._id,
          category: member.category,
          name: member.name,
          status: member.status,
        }))
    );
  }
}
