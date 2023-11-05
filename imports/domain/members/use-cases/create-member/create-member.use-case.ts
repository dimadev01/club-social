import { err, ok, Result } from 'neverthrow';
import { inject, injectable } from 'tsyringe';
import { ILogger } from '@application/logger/logger.interface';
import { IUseCase } from '@application/use-cases/use-case.interface';
import { Member } from '@domain/members/entities/member.entity';
import { IMemberPort } from '@domain/members/member.port';
import { CreateMemberRequestDto } from '@domain/members/use-cases/create-member/create-member-request.dto';
import { Permission, Role, Scope } from '@domain/roles/roles.enum';
import { CreateUserUseCase } from '@domain/users/use-cases/create-user/create-user.use-case';
import { DIToken } from '@infra/di/di-tokens';
import { UseCase } from '@infra/use-cases/use-case';

@injectable()
export class CreateMemberUseCase
  extends UseCase<CreateMemberRequestDto>
  implements IUseCase<CreateMemberRequestDto, string>
{
  public constructor(
    private readonly _createUserUseCase: CreateUserUseCase,
    @inject(DIToken.Logger)
    private readonly _logger: ILogger,
    @inject(DIToken.MemberRepository)
    private readonly _memberPort: IMemberPort
  ) {
    super();
  }

  public async execute(
    request: CreateMemberRequestDto
  ): Promise<Result<string, Error>> {
    await this.validatePermission(Scope.Members, Permission.Create);

    const createUserResult = await this._createUserUseCase.execute({
      emails: request.emails,
      firstName: request.firstName,
      lastName: request.lastName,
      role: Role.Member,
    });

    if (createUserResult.isErr()) {
      return err(createUserResult.error);
    }

    const member = Member.create({
      address: {
        cityGovId: request.addressCityGovId,
        cityName: request.addressCityName,
        stateGovId: request.addressStateGovId,
        stateName: request.addressStateName,
        street: request.addressStreet,
        zipCode: request.addressZipCode,
      },
      category: request.category,
      dateOfBirth: request.dateOfBirth,
      documentID: request.documentID,
      emails: request.emails,
      fileStatus: request.fileStatus,
      firstName: request.firstName,
      lastName: request.lastName,
      maritalStatus: request.maritalStatus,
      nationality: request.nationality,
      phones: request.phones,
      sex: request.sex,
      status: request.status,
      userId: createUserResult.value,
    });

    if (member.isErr()) {
      return err(member.error);
    }

    await this._memberPort.create(member.value);

    this._logger.info('Member created', { member });

    return ok(member.value._id);
  }
}
